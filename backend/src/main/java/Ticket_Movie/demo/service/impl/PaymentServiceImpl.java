package Ticket_Movie.demo.service.impl;

import Ticket_Movie.demo.config.VnpayConfig;
import Ticket_Movie.demo.dto.response.PaymentResponse;
import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.Payment;
import Ticket_Movie.demo.entity.User;
import Ticket_Movie.demo.exception.AppException;
import Ticket_Movie.demo.exception.ResourceNotFoundException;
import Ticket_Movie.demo.repository.BookingRepository;
import Ticket_Movie.demo.repository.PaymentRepository;
import Ticket_Movie.demo.service.BookingService;
import Ticket_Movie.demo.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final BookingService bookingService;
    private final VnpayConfig vnpayConfig;
    private final Ticket_Movie.demo.service.PayOSService payOSService;

    @Override
    @Transactional
    public PaymentResponse createPayment(Integer bookingId, String methodStr, HttpServletRequest request, User user) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + bookingId));

        if (booking.getStatus() == Booking.Status.PAID) {
            throw new AppException(400, "Đơn hàng này đã được thanh toán trước đó");
        }
        if (booking.getStatus() == Booking.Status.EXPIRED || booking.getStatus() == Booking.Status.CANCELLED) {
            throw new AppException(400, "Đơn hàng đã hết hạn hoặc bị hủy");
        }
        if (booking.getExpiresAt() != null && booking.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(400, "Thời gian giữ ghế đã hết hạn");
        }

        Payment.Method method;
        try {
            method = Payment.Method.valueOf(methodStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            method = Payment.Method.VNPAY;
        }

        // Lưu vào DB là BANKING để tương thích tuyệt đối với schema MySQL hiện có (enum CASH, BANKING, MOMO, VNPAY, CARD)
        Payment.Method dbMethod = (method == Payment.Method.PAYOS) ? Payment.Method.BANKING : method;

        Payment payment = paymentRepository.findByBookingBookingId(bookingId)
                .orElse(Payment.builder()
                        .booking(booking)
                        .amount(booking.getTotalAmount())
                        .method(dbMethod)
                        .status(Payment.Status.PENDING)
                        .build());

        payment.setMethod(dbMethod);
        payment.setAmount(booking.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment = paymentRepository.save(payment);

        String paymentUrl = null;
        if (method == Payment.Method.PAYOS) {
            return payOSService.createPaymentRequest(booking, payment);
        } else if (method == Payment.Method.VNPAY) {
            paymentUrl = generateVnpayUrl(booking, payment, request);
        } else if (method == Payment.Method.CASH || method == Payment.Method.BANKING) {
            // Giả lập thanh toán trực tiếp thành công
            payment.setStatus(Payment.Status.SUCCESS);
            payment.setTransactionId("TXN-" + System.currentTimeMillis());
            paymentRepository.save(payment);
            bookingService.confirmBookingPayment(booking.getBookingId(), payment.getTransactionId());
        }

        return PaymentResponse.builder()
                .bookingId(booking.getBookingId())
                .paymentId(payment.getPaymentId())
                .amount(payment.getAmount())
                .paymentUrl(paymentUrl)
                .method(payment.getMethod().name())
                .status(payment.getStatus().name())
                .build();
    }

    @Override
    @Transactional
    public PaymentResponse handleVnpayCallback(Map<String, String> queryParams) {
        String vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
        String vnp_TxnRef = queryParams.get("vnp_TxnRef"); // chính là paymentId hoặc bookingId
        String vnp_TransactionNo = queryParams.get("vnp_TransactionNo");

        if (vnp_TxnRef == null) {
            throw new AppException(400, "Thiếu tham số giao dịch VNPAY");
        }

        Integer bookingId = Integer.parseInt(vnp_TxnRef);
        Payment payment = paymentRepository.findByBookingBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch thanh toán cho booking: " + bookingId));

        if ("00".equals(vnp_ResponseCode)) {
            payment.setStatus(Payment.Status.SUCCESS);
            payment.setTransactionId(vnp_TransactionNo != null ? vnp_TransactionNo : "VNPAY-" + System.currentTimeMillis());
            paymentRepository.save(payment);
            bookingService.confirmBookingPayment(bookingId, payment.getTransactionId());
        } else {
            payment.setStatus(Payment.Status.FAILED);
            paymentRepository.save(payment);
        }

        return PaymentResponse.builder()
                .bookingId(bookingId)
                .paymentId(payment.getPaymentId())
                .amount(payment.getAmount())
                .method("VNPAY")
                .status(payment.getStatus().name())
                .build();
    }

    private String generateVnpayUrl(Booking booking, Payment payment, HttpServletRequest request) {
        long amount = booking.getTotalAmount().multiply(new BigDecimal(100)).longValue(); // VNPAY nhân 100

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VnpayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", VnpayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnpayConfig.getVnpTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", String.valueOf(booking.getBookingId()));
        vnp_Params.put("vnp_OrderInfo", "Thanh toan ve xem phim CinePrime #" + booking.getBookingId());
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnpayConfig.getVnpReturnUrl());
        vnp_Params.put("vnp_IpAddr", request != null ? request.getRemoteAddr() : "127.0.0.1");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VnpayConfig.hmacSHA512(vnpayConfig.getSecretKey(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return vnpayConfig.getVnpPayUrl() + "?" + queryUrl;
    }
}
