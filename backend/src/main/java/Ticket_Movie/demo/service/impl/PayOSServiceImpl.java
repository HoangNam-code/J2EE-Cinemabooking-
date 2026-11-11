package Ticket_Movie.demo.service.impl;

import Ticket_Movie.demo.config.PayOSConfig;
import Ticket_Movie.demo.dto.response.PaymentResponse;
import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.Payment;
import Ticket_Movie.demo.exception.AppException;
import Ticket_Movie.demo.exception.ResourceNotFoundException;
import Ticket_Movie.demo.repository.BookingRepository;
import Ticket_Movie.demo.repository.PaymentRepository;
import Ticket_Movie.demo.service.BookingService;
import Ticket_Movie.demo.service.PayOSService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayOSServiceImpl implements PayOSService {

    private final PayOSConfig payOSConfig;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    private final ObjectMapper objectMapper;

    private static final String PAYOS_API_URL = "https://api-merchant.payos.vn/v2/payment-requests";
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Override
    @Transactional
    public PaymentResponse createPaymentRequest(Booking booking, Payment payment) {
        if (!payOSConfig.isConfigured()) {
            throw new AppException(400, "Hệ thống chưa được cấu hình PayOS. Vui lòng cấu hình PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY trong file .env");
        }

        long amount = booking.getTotalAmount().longValue();
        if (amount <= 0) {
            throw new AppException(400, "Số tiền thanh toán không hợp lệ: " + amount);
        }

        // Sinh mã orderCode số nguyên dương duy nhất: bookingId + 4 chữ số ngẫu nhiên
        long orderCode = Long.parseLong(booking.getBookingId() + String.format("%04d", (int) (Math.random() * 9000 + 1000)));

        // Hết hạn sau đúng 5 phút (300 giây)
        long expiredAt = (System.currentTimeMillis() / 1000) + 300;

        // Nội dung chuyển khoản: tối đa 25 ký tự, không dấu (ví dụ: CP 12)
        String description = "CP " + booking.getBookingId();
        if (description.length() > 25) {
            description = description.substring(0, 25);
        }

        String cancelUrl = payOSConfig.getCancelUrl();
        String returnUrl = payOSConfig.getReturnUrl();

        // Ký số HMAC_SHA256 theo chuẩn PayOS (sắp xếp theo alphabet: amount, cancelUrl, description, orderCode, returnUrl)
        String dataToSign = String.format("amount=%d&cancelUrl=%s&description=%s&orderCode=%d&returnUrl=%s",
                amount, cancelUrl, description, orderCode, returnUrl);
        String signature = payOSConfig.hmacSha256(dataToSign);

        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("orderCode", orderCode);
        requestBody.put("amount", amount);
        requestBody.put("description", description);
        if (booking.getUser() != null) {
            if (booking.getUser().getFullName() != null) {
                requestBody.put("buyerName", booking.getUser().getFullName());
            }
            if (booking.getUser().getEmail() != null) {
                requestBody.put("buyerEmail", booking.getUser().getEmail());
            }
            if (booking.getUser().getPhone() != null) {
                requestBody.put("buyerPhone", booking.getUser().getPhone());
            }
        }
        requestBody.put("cancelUrl", cancelUrl);
        requestBody.put("returnUrl", returnUrl);
        requestBody.put("expiredAt", expiredAt);
        requestBody.put("signature", signature);

        try {
            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(PAYOS_API_URL))
                    .header("Content-Type", "application/json")
                    .header("x-client-id", payOSConfig.getClientId())
                    .header("x-api-key", payOSConfig.getApiKey())
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("Lỗi gọi PayOS tạo link thanh toán, status: {}, body: {}", response.statusCode(), response.body());
                JsonNode errNode = objectMapper.readTree(response.body());
                String msg = errNode.has("desc") ? errNode.get("desc").asText() : "Không thể khởi tạo mã QR PayOS";
                throw new AppException(400, "Lỗi PayOS: " + msg);
            }

            JsonNode rootNode = objectMapper.readTree(response.body());
            String code = rootNode.path("code").asText("");
            if (!"00".equals(code)) {
                String desc = rootNode.path("desc").asText("Khởi tạo PayOS thất bại");
                throw new AppException(400, "Lỗi PayOS (" + code + "): " + desc);
            }

            JsonNode dataNode = rootNode.path("data");
            String bin = dataNode.path("bin").asText("");
            String accountNumber = dataNode.path("accountNumber").asText("");
            String accountName = dataNode.path("accountName").asText("");
            String qrCode = dataNode.path("qrCode").asText("");
            String checkoutUrl = dataNode.path("checkoutUrl").asText("");
            String payosStatus = dataNode.path("status").asText("PENDING");
            // QUAN TRỌNG: Lấy đúng nội dung chuyển khoản (description) do PayOS sinh ra (có mã định danh đầu dòng, VD: CS... CP 12)
            String payosDescription = dataNode.path("description").asText(description);
            if (payosDescription == null || payosDescription.isBlank()) {
                payosDescription = description;
            }

            // Tạo link ảnh VietQR trực quan với đúng payosDescription của PayOS
            String qrUrl = String.format("https://img.vietqr.io/image/%s-%s-compact2.png?amount=%d&addInfo=%s&accountName=%s",
                    bin, accountNumber, amount,
                    URLEncoder.encode(payosDescription, StandardCharsets.UTF_8),
                    URLEncoder.encode(accountName, StandardCharsets.UTF_8));

            // Lưu orderCode vào transactionId để đối soát và kiểm tra trạng thái.
            // Nếu trước đó đơn đã từng tạo orderCode khác thì giữ lại cả hai (ngăn cách dấu phẩy) để không mất mã cũ khi khách quét mã đầu tiên.
            payment.setMethod(Payment.Method.BANKING);
            String existingTx = payment.getTransactionId();
            String newOrderCodeStr = String.valueOf(orderCode);
            if (existingTx != null && !existingTx.isBlank() && !existingTx.startsWith("TXN-")) {
                String combined = newOrderCodeStr + "," + existingTx;
                payment.setTransactionId(combined.length() <= 95 ? combined : newOrderCodeStr);
            } else {
                payment.setTransactionId(newOrderCodeStr);
            }
            payment.setStatus(Payment.Status.PENDING);
            paymentRepository.save(payment);

            return PaymentResponse.builder()
                    .bookingId(booking.getBookingId())
                    .paymentId(payment.getPaymentId())
                    .amount(booking.getTotalAmount())
                    .method("PAYOS")
                    .status(payosStatus)
                    .orderCode(orderCode)
                    .qrCode(qrCode)
                    .qrUrl(qrUrl)
                    .accountNumber(accountNumber)
                    .accountName(accountName)
                    .bin(bin)
                    .description(payosDescription)
                    .expiredAt(expiredAt)
                    .paymentUrl(checkoutUrl)
                    .build();

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Ngoại lệ khi gọi PayOS createPaymentRequest", e);
            throw new AppException(500, "Không thể kết nối cổng thanh toán PayOS: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Map<String, Object> checkPaymentStatus(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + bookingId));

        Payment payment = paymentRepository.findByBookingBookingId(bookingId).orElse(null);

        // 1. Kiểm tra trong DB: Nếu đã PAID hoặc payment SUCCESS
        if (booking.getStatus() == Booking.Status.PAID
                || (payment != null && payment.getStatus() == Payment.Status.SUCCESS)) {
            return Map.of("paid", true, "status", "PAID");
        }

        if (payment == null || payment.getTransactionId() == null || payment.getTransactionId().isBlank()) {
            return Map.of("paid", false, "status", booking.getStatus().name());
        }

        String rawOrderCodes = payment.getTransactionId();

        // 2. Chủ động gọi API GET https://api-merchant.payos.vn/v2/payment-requests/{id} theo tài liệu https://payos.vn/docs/api/
        if (payOSConfig.isConfigured()) {
            String[] codes = rawOrderCodes.split(",");
            for (String codeItem : codes) {
                String orderCode = codeItem.trim();
                if (orderCode.isEmpty()) continue;

                try {
                    HttpRequest request = HttpRequest.newBuilder()
                            .uri(URI.create(PAYOS_API_URL + "/" + orderCode))
                            .header("x-client-id", payOSConfig.getClientId())
                            .header("x-api-key", payOSConfig.getApiKey())
                            .GET()
                            .timeout(Duration.ofSeconds(6))
                            .build();

                    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                    if (response.statusCode() == 200) {
                        JsonNode root = objectMapper.readTree(response.body());
                        if ("00".equals(root.path("code").asText())) {
                            JsonNode dataNode = root.path("data");
                            String status = dataNode.path("status").asText("");
                            long amountPaid = dataNode.path("amountPaid").asLong(0);
                            long amountRequired = dataNode.path("amount").asLong(0);
                            long amountRemaining = dataNode.path("amountRemaining").asLong(-1);

                            boolean isPaidOnPayOS = "PAID".equalsIgnoreCase(status)
                                    || (amountRequired > 0 && amountPaid >= amountRequired)
                                    || (amountRequired > 0 && amountRemaining == 0 && amountPaid > 0);

                            if (isPaidOnPayOS) {
                                // Cập nhật thanh toán thành công, tự động xuất vé và gửi email
                                payment.setStatus(Payment.Status.SUCCESS);
                                payment.setTransactionId(orderCode);
                                paymentRepository.save(payment);
                                bookingService.confirmBookingPayment(bookingId, orderCode);
                                log.info("✅ [PayOS API] Đơn #{} ĐÃ THANH TOÁN thành công (orderCode={}, amountPaid={})", bookingId, orderCode, amountPaid);
                                return Map.of("paid", true, "status", "PAID", "orderCode", orderCode);
                            }
                        }
                    }
                } catch (Exception e) {
                    log.warn("Không thể truy vấn trạng thái PayOS cho orderCode {}: {}", orderCode, e.getMessage());
                }
            }
        }

        return Map.of("paid", false, "status", "PENDING");
    }

    @Override
    @Transactional
    public Map<String, Object> handleWebhook(Map<String, Object> payload) {
        if (!payOSConfig.isConfigured()) {
            return Map.of("error", 1, "message", "PayOS chưa được cấu hình");
        }

        try {
            log.info("Nhận Webhook từ PayOS: {}", payload);
            String signature = (String) payload.get("signature");
            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) payload.get("data");

            if (data == null || signature == null) {
                return Map.of("error", 1, "message", "Thiếu dữ liệu Webhook");
            }

            // Kiểm tra chữ ký dữ liệu theo đúng chuẩn tài liệu PayOS:
            // https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/
            if (!payOSConfig.isValidData(data, signature)) {
                String expectedSignature = payOSConfig.createSignatureFromObj(data);
                log.warn("Chữ ký PayOS Webhook không hợp lệ! expected: {}, actual: {}", expectedSignature, signature);
                return Map.of("error", 1, "message", "Chữ ký không khớp");
            }

            String code = String.valueOf(data.getOrDefault("code", ""));
            String orderCode = String.valueOf(data.getOrDefault("orderCode", ""));

            // Bỏ qua webhook test mặc định của PayOS (orderCode = 123) nhưng vẫn trả về 200 OK để PayOS xác thực URL
            if ("123".equals(orderCode)) {
                return Map.of("error", 0, "message", "Webhook test thành công");
            }

            if ("00".equals(code)) {
                // Tìm kiếm Payment theo transactionId = orderCode
                Payment payment = paymentRepository.findByTransactionId(orderCode).orElse(null);
                if (payment != null && payment.getStatus() != Payment.Status.SUCCESS) {
                    payment.setStatus(Payment.Status.SUCCESS);
                    paymentRepository.save(payment);
                    bookingService.confirmBookingPayment(payment.getBooking().getBookingId(), orderCode);
                    log.info("PayOS Webhook: Đã xác nhận thanh toán đơn #{} thành công!", payment.getBooking().getBookingId());
                }
            }

            return Map.of("error", 0, "message", "Xác nhận Webhook thành công");
        } catch (Exception e) {
            log.error("Lỗi khi xử lý PayOS Webhook", e);
            return Map.of("error", 1, "message", e.getMessage());
        }
    }
}
