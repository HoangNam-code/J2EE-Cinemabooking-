package Ticket_Movie.demo.service.impl;

import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.Showtime;
import Ticket_Movie.demo.entity.Ticket;
import Ticket_Movie.demo.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:no-reply@cineprime.vn}")
    private String fromEmail;

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
        // Thực thi bất đồng bộ để không chặn luồng thanh toán
        CompletableFuture.runAsync(() -> {
            try {
                if (booking.getUser() == null || booking.getUser().getEmail() == null) {
                    log.warn("Không tìm thấy email người nhận cho Booking ID: {}", booking.getBookingId());
                    return;
                }

                String recipientEmail = booking.getUser().getEmail();
                String recipientName = booking.getUser().getFullName() != null ? booking.getUser().getFullName() : booking.getUser().getUsername();

                Showtime showtime = booking.getShowtime();
                String movieName = (showtime != null && showtime.getMovie() != null) ? showtime.getMovie().getMovieName() : "Vé Xem Phim";
                String cinemaName = (showtime != null && showtime.getRoom() != null && showtime.getRoom().getCinema() != null)
                        ? showtime.getRoom().getCinema().getCinemaName() : "CinePrime Cinema";
                String roomName = (showtime != null && showtime.getRoom() != null) ? showtime.getRoom().getRoomName() : "Phòng Chiếu";
                String showDate = showtime != null && showtime.getShowDate() != null ? showtime.getShowDate().toString() : "Hôm nay";
                String startTime = showtime != null && showtime.getStartTime() != null ? showtime.getStartTime().toString().substring(0, 5) : "";

                String seatsList = booking.getTickets() != null
                        ? booking.getTickets().stream().map(t -> t.getSeat() != null ? t.getSeat().getSeatCode() : "").filter(s -> !s.isEmpty()).collect(Collectors.joining(", "))
                        : "N/A";

                String qrCodeData = (booking.getTickets() != null && !booking.getTickets().isEmpty() && booking.getTickets().get(0).getQrCode() != null)
                        ? booking.getTickets().get(0).getQrCode()
                        : booking.getBookingRef();

                String qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + qrCodeData;

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail, "CinePrime Cinema");
                helper.setTo(recipientEmail);
                helper.setSubject("🎟️ [CinePrime] Xác nhận đặt vé thành công #" + booking.getBookingRef() + " - " + movieName);

                // Template Email HTML Dark & Gold đẳng cấp rạp chiếu
                String htmlTemplate = """
                    <!DOCTYPE html>
                    <html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body { margin: 0; padding: 0; background-color: #0b0c10; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f8fafc; }
                            .container { max-width: 600px; margin: 30px auto; background: #0f1117; border: 1px solid #262626; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
                            .header { background: linear-gradient(135deg, #1c1917, #0b0c10); padding: 30px 20px; text-align: center; border-bottom: 2px solid #fbbf24; }
                            .brand { font-size: 26px; font-weight: 800; letter-spacing: 2px; color: #fbbf24; text-transform: uppercase; margin: 0; }
                            .sub-brand { font-size: 12px; color: #a8a29e; letter-spacing: 3px; text-transform: uppercase; margin-top: 5px; }
                            .content { padding: 30px 25px; }
                            .success-badge { display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; margin-bottom: 20px; }
                            .movie-title { font-size: 22px; font-weight: bold; color: #ffffff; margin: 0 0 15px 0; }
                            .ticket-card { background: #18181b; border: 1px dashed #3f3f46; border-radius: 12px; padding: 20px; margin: 20px 0; }
                            .info-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
                            .info-label { color: #a1a1aa; }
                            .info-value { color: #ffffff; font-weight: 600; text-align: right; }
                            .total-row { border-top: 1px solid #27272a; padding-top: 15px; margin-top: 15px; }
                            .total-price { font-size: 20px; font-weight: 800; color: #fbbf24; }
                            .qr-section { text-align: center; padding: 25px 10px; background: #141417; border-radius: 12px; margin-top: 25px; }
                            .qr-code { border-radius: 10px; border: 4px solid #ffffff; background: #ffffff; padding: 6px; }
                            .qr-guide { font-size: 12px; color: #a1a1aa; margin-top: 10px; }
                            .footer { background: #090a0f; padding: 20px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #1f1f23; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1 class="brand">CINEPRIME</h1>
                                <div class="sub-brand">PREMIUM CINEMA EXPERIENCE</div>
                            </div>
                            <div class="content">
                                <div style="text-align: center;">
                                    <span class="success-badge">✓ XÁC NHẬN ĐẶT VÉ THÀNH CÔNG</span>
                                </div>
                                <p>Xin chào <strong>{{RECIPIENT_NAME}}</strong>,</p>
                                <p>Cảm ơn bạn đã lựa chọn CinePrime. Đơn đặt vé của bạn đã được thanh toán thành công và sẵn sàng để thưởng thức tại rạp.</p>
                                
                                <div class="ticket-card">
                                    <h2 class="movie-title">{{MOVIE_NAME}}</h2>
                                    <div class="info-row">
                                        <span class="info-label">Mã đặt vé:</span>
                                        <span class="info-value" style="color: #fbbf24; font-family: monospace;">{{BOOKING_REF}}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Cụm rạp:</span>
                                        <span class="info-value">{{CINEMA_NAME}}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Phòng chiếu:</span>
                                        <span class="info-value">{{ROOM_NAME}}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Suất chiếu:</span>
                                        <span class="info-value">{{SHOWTIME}}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Ghế ngồi:</span>
                                        <span class="info-value" style="color: #f43f5e; font-size: 15px;">{{SEATS_LIST}}</span>
                                    </div>
                                    <div class="info-row total-row">
                                        <span class="info-label" style="font-size: 16px; font-weight: bold; color: #ffffff;">Tổng thanh toán:</span>
                                        <span class="total-price">{{TOTAL_PRICE}}</span>
                                    </div>
                                </div>

                                <div class="qr-section">
                                    <img src="{{QR_IMAGE_URL}}" alt="QR Check-in" class="qr-code" width="160" height="160"/>
                                    <div class="qr-guide">Vui lòng xuất trình mã QR này tại cổng soát vé hoặc quầy tự phục vụ tại rạp.</div>
                                </div>
                            </div>
                            <div class="footer">
                                <p>© 2026 CinePrime Cinema System. Đồ án J2EE & Spring for GraphQL.</p>
                                <p>Mọi thắc mắc xin vui lòng liên hệ hotline hỗ trợ 1900 8888 hoặc quầy vé tại rạp.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """;

                String htmlContent = htmlTemplate
                        .replace("{{RECIPIENT_NAME}}", recipientName != null ? recipientName : "Quý khách")
                        .replace("{{MOVIE_NAME}}", movieName)
                        .replace("{{BOOKING_REF}}", booking.getBookingRef() != null ? booking.getBookingRef() : "")
                        .replace("{{CINEMA_NAME}}", cinemaName)
                        .replace("{{ROOM_NAME}}", roomName)
                        .replace("{{SHOWTIME}}", startTime + " - " + showDate)
                        .replace("{{SEATS_LIST}}", seatsList)
                        .replace("{{TOTAL_PRICE}}", formatVND(booking.getTotalAmount()))
                        .replace("{{QR_IMAGE_URL}}", qrImageUrl);

                helper.setText(htmlContent, true);
                mailSender.send(message);
                log.info("Đã gửi email xác nhận vé thành công tới {}", recipientEmail);

            } catch (Exception e) {
                log.warn("Không thể gửi email xác nhận đặt vé: {}", e.getMessage());
            }
        });
    }

    @Override
    public void sendBookingCancellationEmail(Booking booking) {
        CompletableFuture.runAsync(() -> {
            try {
                if (booking.getUser() == null || booking.getUser().getEmail() == null) return;
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail, "CinePrime Cinema");
                helper.setTo(booking.getUser().getEmail());
                helper.setSubject("⚠️ [CinePrime] Thông báo hủy đơn đặt vé #" + booking.getBookingRef());
                helper.setText("<div style='font-family: sans-serif; padding: 20px;'><h3>Thông báo hủy đơn vé #" + booking.getBookingRef() + "</h3><p>Đơn đặt vé xem phim của bạn đã được hủy thành công theo yêu cầu hoặc do hết hạn giữ chỗ.</p></div>", true);
                mailSender.send(message);
            } catch (Exception e) {
                log.warn("Không thể gửi email hủy vé: {}", e.getMessage());
            }
        });
    }
}
