package Ticket_Movie.demo.service.impl;

import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.BookingFood;
import Ticket_Movie.demo.entity.Payment;
import Ticket_Movie.demo.entity.Showtime;
import Ticket_Movie.demo.entity.Ticket;
import Ticket_Movie.demo.repository.PaymentRepository;
import Ticket_Movie.demo.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final PaymentRepository paymentRepository;

    // Lưu thời điểm gửi mail gần nhất của từng bookingId để chống gửi trùng khi polling/webhook gọi đồng thời
    private final Map<Integer, Long> recentSentBookings = new ConcurrentHashMap<>();

    @Value("${spring.mail.username:no-reply@cineprime.vn}")
    private String fromEmail;

    private static final DateTimeFormatter DATE_TIME_FMT = DateTimeFormatter.ofPattern("HH:mm:ss - dd/MM/yyyy");

    private String formatVND(Object amount) {
        if (amount == null) return "0 ₫";
        try {
            double val = Double.parseDouble(amount.toString());
            return NumberFormat.getInstance(new Locale("vi", "VN")).format(val) + " ₫";
        } catch (Exception e) {
            return amount + " ₫";
        }
    }

    @Override
    public void sendBookingConfirmationEmail(Booking booking) {
        if (booking == null || booking.getUser() == null || booking.getUser().getEmail() == null) {
            log.warn("Không tìm thấy email người nhận cho Booking ID: {}", booking != null ? booking.getBookingId() : null);
            return;
        }

        if (booking.getBookingId() != null) {
            Long lastSent = recentSentBookings.get(booking.getBookingId());
            if (lastSent != null && (System.currentTimeMillis() - lastSent) < 15000) {
                log.info("Email xác nhận cho đơn #{} vừa được gửi, bỏ qua gửi trùng.", booking.getBookingId());
                return;
            }
            recentSentBookings.put(booking.getBookingId(), System.currentTimeMillis());
        }

        // 1. Trích xuất toàn bộ dữ liệu ngay trên luồng Transaction hiện tại để tránh LazyInitializationException
        final Integer bookingId = booking.getBookingId();
        final String bookingRef = booking.getBookingRef();
        final String recipientEmail = booking.getUser().getEmail().trim();
        final String recipientName = booking.getUser().getFullName() != null && !booking.getUser().getFullName().isBlank()
                ? booking.getUser().getFullName()
                : booking.getUser().getUsername();
        final String recipientPhone = booking.getUser().getPhone() != null ? booking.getUser().getPhone() : "Chưa cập nhật";

        Showtime showtime = booking.getShowtime();
        final String movieName = (showtime != null && showtime.getMovie() != null)
                ? showtime.getMovie().getMovieName() : "Vé Xem Phim CinePrime";
        final String cinemaName = (showtime != null && showtime.getRoom() != null && showtime.getRoom().getCinema() != null)
                ? showtime.getRoom().getCinema().getCinemaName() : "CinePrime Cinema";
        final String roomName = (showtime != null && showtime.getRoom() != null)
                ? showtime.getRoom().getRoomName() : "Phòng Chiếu Tiêu Chuẩn";
        final String showDate = (showtime != null && showtime.getShowDate() != null)
                ? showtime.getShowDate().toString() : "Hôm nay";
        final String startTime = (showtime != null && showtime.getStartTime() != null)
                ? (showtime.getStartTime().toString().length() >= 5 ? showtime.getStartTime().toString().substring(0, 5) : showtime.getStartTime().toString())
                : "";

        // Danh sách ghế & tiền vé
        BigDecimal ticketSubtotalCalc = BigDecimal.ZERO;
        List<String> seatDescriptions = new ArrayList<>();
        StringBuilder ticketRowsHtml = new StringBuilder();
        String firstQrCode = bookingRef;

        if (booking.getTickets() != null && !booking.getTickets().isEmpty()) {
            if (booking.getTickets().get(0).getQrCode() != null) {
                firstQrCode = booking.getTickets().get(0).getQrCode();
            }
            for (Ticket t : booking.getTickets()) {
                String seatCode = t.getSeat() != null ? t.getSeat().getSeatCode() : "N/A";
                String seatType = (t.getSeat() != null && t.getSeat().getSeatType() != null)
                        ? t.getSeat().getSeatType().name() : "NORMAL";
                BigDecimal price = t.getPrice() != null ? t.getPrice() : BigDecimal.ZERO;
                ticketSubtotalCalc = ticketSubtotalCalc.add(price);
                seatDescriptions.add(seatCode + " (" + seatType + ")");

                ticketRowsHtml.append(String.format("""
                    <tr>
                        <td style="padding: 8px 0; color: #e4e4e7; font-size: 13px; border-bottom: 1px solid #27272a;">
                            Ghế <strong style="color: #fbbf24;">%s</strong> <span style="color: #a1a1aa; font-size: 12px;">(%s)</span>
                        </td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #27272a;">
                            %s
                        </td>
                    </tr>
                    """, seatCode, seatType, formatVND(price)));
            }
        }
        final String seatsList = seatDescriptions.isEmpty() ? "Không có ghế (Đơn bắp nước)" : String.join(", ", seatDescriptions);
        final String finalTicketRowsHtml = ticketRowsHtml.toString();
        final String qrCodeData = firstQrCode;

        // Danh sách bắp nước & tiền bắp nước
        BigDecimal foodSubtotalCalc = BigDecimal.ZERO;
        StringBuilder foodRowsHtml = new StringBuilder();
        if (booking.getBookingFoods() != null && !booking.getBookingFoods().isEmpty()) {
            for (BookingFood bf : booking.getBookingFoods()) {
                String foodName = bf.getFood() != null ? bf.getFood().getFoodName() : "Bắp nước";
                int qty = bf.getQuantity() != null ? bf.getQuantity() : 1;
                BigDecimal unitPrice = bf.getPrice() != null ? bf.getPrice() : BigDecimal.ZERO;
                BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(qty));
                foodSubtotalCalc = foodSubtotalCalc.add(lineTotal);

                foodRowsHtml.append(String.format("""
                    <tr>
                        <td style="padding: 8px 0; color: #e4e4e7; font-size: 13px; border-bottom: 1px solid #27272a;">
                            🍿 %s <strong style="color: #fbbf24;">x%d</strong>
                            <span style="color: #71717a; font-size: 11px;">(%s/phần)</span>
                        </td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #27272a;">
                            %s
                        </td>
                    </tr>
                    """, foodName, qty, formatVND(unitPrice), formatVND(lineTotal)));
            }
        }
        final boolean hasFoods = foodRowsHtml.length() > 0;
        final String finalFoodRowsHtml = foodRowsHtml.toString();

        final BigDecimal totalAmount = booking.getTotalAmount() != null ? booking.getTotalAmount() : BigDecimal.ZERO;
        final BigDecimal ticketSubtotal = ticketSubtotalCalc;
        final BigDecimal foodSubtotal = foodSubtotalCalc;
        BigDecimal rawSum = ticketSubtotal.add(foodSubtotal);
        final BigDecimal discountAmount = rawSum.compareTo(totalAmount) > 0 ? rawSum.subtract(totalAmount) : BigDecimal.ZERO;

        // Thông tin thanh toán từ bảng payments
        Payment payment = bookingId != null ? paymentRepository.findByBookingBookingId(bookingId).orElse(null) : null;
        final String transactionId = (payment != null && payment.getTransactionId() != null)
                ? payment.getTransactionId() : ("PAYOS-" + bookingId);
        String rawMethod = (payment != null && payment.getMethod() != null) ? payment.getMethod().name() : "BANKING";
        final String paymentMethodDisplay = switch (rawMethod) {
            case "BANKING", "PAYOS" -> "Chuyển khoản VietQR (PayOS)";
            case "VNPAY" -> "Cổng thanh toán VNPAY";
            case "CASH" -> "Tiền mặt tại quầy";
            default -> rawMethod;
        };
        LocalDateTime payTime = (payment != null && payment.getPaymentDate() != null)
                ? payment.getPaymentDate() : LocalDateTime.now();
        final String paymentTimeDisplay = payTime.format(DATE_TIME_FMT);

        // 2. Gửi email bất đồng bộ để không chặn phản hồi của khách hàng
        CompletableFuture.runAsync(() -> {
            try {
                String encodedQr = URLEncoder.encode(qrCodeData, StandardCharsets.UTF_8);
                String qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=" + encodedQr;

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail, "CinePrime Cinema");
                helper.setTo(recipientEmail);
                helper.setSubject("🎟️ [CinePrime] Vé điện tử & Biên lai thanh toán #" + bookingRef + " - " + movieName);

                String foodSectionHtml = hasFoods ? String.format("""
                    <div style="margin-top: 18px;">
                        <div style="font-size: 12px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                            🍿 Bắp Nước & Combo Kèm Theo
                        </div>
                        <table width="100%%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                            %s
                        </table>
                    </div>
                    """, finalFoodRowsHtml) : "";

                String discountRowHtml = discountAmount.compareTo(BigDecimal.ZERO) > 0 ? String.format("""
                    <tr>
                        <td style="padding: 6px 0; color: #34d399; font-size: 13px;">Khuyến mãi giảm giá:</td>
                        <td style="padding: 6px 0; color: #34d399; font-size: 13px; font-weight: 700; text-align: right;">-%s</td>
                    </tr>
                    """, formatVND(discountAmount)) : "";

                String htmlContent = """
                    <!DOCTYPE html>
                    <html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #0b0c10; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
                        <div style="max-width: 620px; margin: 24px auto; background: #0f1117; border: 1px solid #262626; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.85);">

                            <!-- HEADER -->
                            <div style="background: linear-gradient(135deg, #1c1917 0%, #090a0f 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid #fbbf24;">
                                <h1 style="font-size: 28px; font-weight: 900; letter-spacing: 3px; color: #ffffff; margin: 0;">
                                    CINE<span style="color: #fbbf24;">PRIME</span>
                                </h1>
                                <div style="font-size: 11px; color: #a8a29e; letter-spacing: 3px; text-transform: uppercase; margin-top: 6px;">
                                    VÉ XEM PHIM ĐIỆN TỬ & BIÊN LAI THANH TOÁN
                                </div>
                            </div>

                            <!-- CONTENT -->
                            <div style="padding: 28px 24px;">
                                <div style="text-align: center; margin-bottom: 20px;">
                                    <span style="display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; padding: 7px 18px; border-radius: 999px; font-size: 13px; font-weight: 700;">
                                        ✓ ĐÃ NHẬN TIỀN CHUYỂN KHOẢN - VÉ HỢP LỆ
                                    </span>
                                </div>

                                <p style="font-size: 15px; color: #e4e4e7; margin: 0 0 8px 0;">
                                    Xin chào <strong style="color: #fbbf24;">{{RECIPIENT_NAME}}</strong>,
                                </p>
                                <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin: 0 0 22px 0;">
                                    Hệ thống ngân hàng của <strong>CinePrime</strong> đã nhận được khoản thanh toán của bạn. Dưới đây là thông tin chi tiết đơn hàng và <strong>Mã QR Check-in</strong> để bạn vào rạp:
                                </p>

                                <!-- THÔNG TIN SUẤT CHIẾU -->
                                <div style="background: #161821; border: 1px solid #27272a; border-radius: 14px; padding: 20px; margin-bottom: 18px;">
                                    <div style="font-size: 11px; color: #fbbf24; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
                                        THÔNG TIN VÉ & SUẤT CHIẾU
                                    </div>
                                    <h2 style="font-size: 21px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0;">
                                        {{MOVIE_NAME}}
                                    </h2>

                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 13px;">
                                        <tr>
                                            <td style="padding: 7px 0; color: #a1a1aa; border-bottom: 1px dashed #27272a;">Mã đặt vé:</td>
                                            <td style="padding: 7px 0; color: #fbbf24; font-weight: 800; font-family: monospace; font-size: 15px; text-align: right; border-bottom: 1px dashed #27272a;">#{{BOOKING_ID}} ({{BOOKING_REF}})</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 7px 0; color: #a1a1aa; border-bottom: 1px dashed #27272a;">Khách hàng:</td>
                                            <td style="padding: 7px 0; color: #ffffff; font-weight: 600; text-align: right; border-bottom: 1px dashed #27272a;">{{RECIPIENT_NAME}} ({{RECIPIENT_PHONE}})</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 7px 0; color: #a1a1aa; border-bottom: 1px dashed #27272a;">Cụm rạp:</td>
                                            <td style="padding: 7px 0; color: #ffffff; font-weight: 600; text-align: right; border-bottom: 1px dashed #27272a;">{{CINEMA_NAME}}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 7px 0; color: #a1a1aa; border-bottom: 1px dashed #27272a;">Phòng chiếu:</td>
                                            <td style="padding: 7px 0; color: #38bdf8; font-weight: 700; text-align: right; border-bottom: 1px dashed #27272a;">{{ROOM_NAME}}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 7px 0; color: #a1a1aa; border-bottom: 1px dashed #27272a;">Suất chiếu:</td>
                                            <td style="padding: 7px 0; color: #fbbf24; font-weight: 700; text-align: right; border-bottom: 1px dashed #27272a;">{{SHOWTIME}}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 7px 0; color: #a1a1aa;">Ghế ngồi:</td>
                                            <td style="padding: 7px 0; color: #f43f5e; font-weight: 800; font-size: 14px; text-align: right;">{{SEATS_LIST}}</td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- CHI TIẾT GIÁ VÉ, BẮP NƯỚC & BIÊN LAI THANH TOÁN -->
                                <div style="background: #161821; border: 1px solid #27272a; border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                                    <div style="font-size: 12px; font-weight: 700; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                                        🎟️ Chi Tiết Ghế Đặt
                                    </div>
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                        {{TICKET_ROWS}}
                                    </table>

                                    {{FOOD_SECTION}}

                                    <!-- TỔNG KẾT GIÁ TIỀN -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 14px;">
                                        <tr>
                                            <td style="padding: 6px 0; color: #a1a1aa; font-size: 13px;">Tổng tiền vé:</td>
                                            <td style="padding: 6px 0; color: #e4e4e7; font-size: 13px; text-align: right;">{{TICKET_SUBTOTAL}}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 6px 0; color: #a1a1aa; font-size: 13px;">Tổng tiền bắp nước:</td>
                                            <td style="padding: 6px 0; color: #e4e4e7; font-size: 13px; text-align: right;">{{FOOD_SUBTOTAL}}</td>
                                        </tr>
                                        {{DISCOUNT_ROW}}
                                        <tr>
                                            <td style="padding: 12px 0 6px 0; color: #ffffff; font-size: 16px; font-weight: 800; border-top: 1px solid #3f3f46;">TỔNG TIỀN ĐÃ THANH TOÁN:</td>
                                            <td style="padding: 12px 0 6px 0; color: #fbbf24; font-size: 20px; font-weight: 900; text-align: right; border-top: 1px solid #3f3f46;">{{TOTAL_PRICE}}</td>
                                        </tr>
                                    </table>

                                    <!-- THÔNG TIN GIAO DỊCH NGÂN HÀNG -->
                                    <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #27272a; font-size: 12px; color: #a1a1aa;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 3px 0;">Phương thức thanh toán:</td>
                                                <td style="padding: 3px 0; color: #34d399; font-weight: 700; text-align: right;">{{PAYMENT_METHOD}}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 3px 0;">Mã giao dịch / OrderCode:</td>
                                                <td style="padding: 3px 0; color: #ffffff; font-family: monospace; text-align: right;">{{TRANSACTION_ID}}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 3px 0;">Thời gian thanh toán:</td>
                                                <td style="padding: 3px 0; color: #e4e4e7; text-align: right;">{{PAYMENT_TIME}}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>

                                <!-- MÃ QR CHECK-IN -->
                                <div style="text-align: center; padding: 24px 16px; background: #14161f; border: 2px dashed #fbbf24; border-radius: 16px;">
                                    <div style="font-size: 12px; font-weight: 800; color: #fbbf24; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px;">
                                        MÃ QR CHECK-IN VÀO RẠP
                                    </div>
                                    <img src="{{QR_IMAGE_URL}}" alt="QR Check-in" width="190" height="190" style="border-radius: 12px; border: 6px solid #ffffff; background: #ffffff; display: inline-block;" />
                                    <div style="margin-top: 10px; font-family: monospace; font-size: 13px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">
                                        {{QR_CODE_TEXT}}
                                    </div>
                                    <div style="font-size: 12px; color: #a1a1aa; margin-top: 8px; line-height: 1.5;">
                                        Vui lòng đưa mã QR này cho nhân viên soát vé tại rạp 15 phút trước giờ chiếu để nhận vé & bắp nước.
                                    </div>
                                </div>
                            </div>

                            <!-- FOOTER -->
                            <div style="background: #090a0f; padding: 20px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #1f1f23;">
                                <p style="margin: 0 0 6px 0;">© 2026 <strong>CinePrime Cinema System</strong> - Hệ thống đặt vé xem phim trực tuyến.</p>
                                <p style="margin: 0;">Hotline hỗ trợ: 1900 8888 | Email: {{FROM_EMAIL}}</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                        .replace("{{RECIPIENT_NAME}}", recipientName)
                        .replace("{{RECIPIENT_PHONE}}", recipientPhone)
                        .replace("{{MOVIE_NAME}}", movieName)
                        .replace("{{BOOKING_ID}}", String.valueOf(bookingId))
                        .replace("{{BOOKING_REF}}", bookingRef != null ? bookingRef : "")
                        .replace("{{CINEMA_NAME}}", cinemaName)
                        .replace("{{ROOM_NAME}}", roomName)
                        .replace("{{SHOWTIME}}", startTime + " - Ngày " + showDate)
                        .replace("{{SEATS_LIST}}", seatsList)
                        .replace("{{TICKET_ROWS}}", finalTicketRowsHtml)
                        .replace("{{FOOD_SECTION}}", foodSectionHtml)
                        .replace("{{TICKET_SUBTOTAL}}", formatVND(ticketSubtotal))
                        .replace("{{FOOD_SUBTOTAL}}", formatVND(foodSubtotal))
                        .replace("{{DISCOUNT_ROW}}", discountRowHtml)
                        .replace("{{TOTAL_PRICE}}", formatVND(totalAmount))
                        .replace("{{PAYMENT_METHOD}}", paymentMethodDisplay)
                        .replace("{{TRANSACTION_ID}}", transactionId)
                        .replace("{{PAYMENT_TIME}}", paymentTimeDisplay)
                        .replace("{{QR_IMAGE_URL}}", qrImageUrl)
                        .replace("{{QR_CODE_TEXT}}", qrCodeData)
                        .replace("{{FROM_EMAIL}}", fromEmail);

                helper.setText(htmlContent, true);
                mailSender.send(message);
                log.info("📧 [MAIL SENT] Đã gửi email vé điện tử & biên lai #{} tới {}", bookingRef, recipientEmail);

            } catch (Exception e) {
                if (bookingId != null) {
                    recentSentBookings.remove(bookingId);
                }
                log.error("⚠️ Không thể gửi email xác nhận đặt vé tới {}: {}", recipientEmail, e.getMessage(), e);
            }
        });
    }

    @Override
    public void sendBookingCancellationEmail(Booking booking) {
        if (booking == null || booking.getUser() == null || booking.getUser().getEmail() == null) return;
        final String recipientEmail = booking.getUser().getEmail();
        final String bookingRef = booking.getBookingRef();

        CompletableFuture.runAsync(() -> {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail, "CinePrime Cinema");
                helper.setTo(recipientEmail);
                helper.setSubject("⚠️ [CinePrime] Thông báo hủy đơn đặt vé #" + bookingRef);
                helper.setText("<div style='font-family: sans-serif; padding: 20px;'><h3>Thông báo hủy đơn vé #" + bookingRef + "</h3><p>Đơn đặt vé xem phim của bạn đã được hủy thành công theo yêu cầu hoặc do hết hạn giữ chỗ.</p></div>", true);
                mailSender.send(message);
            } catch (Exception e) {
                log.warn("Không thể gửi email hủy vé: {}", e.getMessage());
            }
        });
    }

    @Override
    public void sendRegistrationOtpEmail(String toEmail, String otp, String fullName) {
        CompletableFuture.runAsync(() -> {
            try {
                if (toEmail == null || toEmail.trim().isEmpty()) return;

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail, "CinePrime Cinema");
                helper.setTo(toEmail.trim());
                helper.setSubject("🔐 [CinePrime] Mã xác thực đăng ký tài khoản: " + otp);

                String displayName = (fullName != null && !fullName.trim().isEmpty()) ? fullName : "Quý khách";

                String html = """
                    <!DOCTYPE html>
                    <html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body { margin: 0; padding: 0; background-color: #0b0c10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; }
                            .container { max-width: 520px; margin: 30px auto; background-color: #12141c; border-radius: 16px; border: 1px solid #27272a; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }
                            .header { background: linear-gradient(135deg, #18181b 0%, #090a0f 100%); padding: 30px 20px; text-align: center; border-bottom: 2px solid #fbbf24; }
                            .brand { font-size: 26px; font-weight: 900; letter-spacing: 3px; color: #ffffff; margin: 0; }
                            .brand span { color: #fbbf24; }
                            .sub-brand { font-size: 11px; letter-spacing: 2px; color: #a1a1aa; margin-top: 4px; text-transform: uppercase; }
                            .content { padding: 30px 25px; line-height: 1.6; }
                            .greeting { font-size: 16px; color: #e4e4e7; margin-bottom: 15px; }
                            .instruction { font-size: 14px; color: #a1a1aa; margin-bottom: 25px; }
                            .otp-card { background: #181922; border: 1px solid #3f3f46; border-radius: 12px; padding: 25px 15px; text-align: center; margin: 20px 0; }
                            .otp-label { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24; margin-bottom: 8px; }
                            .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ffffff; text-shadow: 0 2px 10px rgba(251,191,36,0.4); margin: 0; }
                            .expire-notice { font-size: 12px; color: #f59e0b; margin-top: 8px; }
                            .warning-box { background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 12px 15px; border-radius: 6px; font-size: 12px; color: #fca5a5; margin-top: 20px; }
                            .footer { background: #090a0f; padding: 20px; text-align: center; font-size: 11px; color: #71717a; border-top: 1px solid #1f1f23; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1 class="brand">CINE<span>PRIME</span></h1>
                                <div class="sub-brand">Premium Cinema Experience</div>
                            </div>
                            <div class="content">
                                <p class="greeting">Xin chào <strong>{{NAME}}</strong>,</p>
                                <p class="instruction">Cảm ơn bạn đã đăng ký tài khoản tại <strong>CinePrime</strong>. Vui lòng sử dụng mã xác thực OTP dưới đây để hoàn tất quá trình đăng ký:</p>

                                <div class="otp-card">
                                    <div class="otp-label">MÃ XÁC THỰC CỦA BẠN</div>
                                    <div class="otp-code">{{OTP}}</div>
                                    <div class="expire-notice">⏱ Mã có hiệu lực trong vòng 5 phút</div>
                                </div>

                                <div class="warning-box">
                                    ⚠️ <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã này với bất kỳ ai để bảo vệ thông tin tài khoản của bạn.
                                </div>
                            </div>
                            <div class="footer">
                                <p>© 2026 CinePrime Cinema System. All rights reserved.</p>
                                <p>Email này được gửi tự động, vui lòng không phản hồi.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                    .replace("{{NAME}}", displayName)
                    .replace("{{OTP}}", otp);

                helper.setText(html, true);
                mailSender.send(message);
                log.info("📧 [MAIL SENT] Đã gửi email mã OTP đăng ký thành công tới {}", toEmail);

            } catch (Exception e) {
                log.warn("⚠️ Không thể gửi email OTP tới {}: {}", toEmail, e.getMessage());
            }
        });
    }
}
