package Ticket_Movie.demo.schedule;

import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.Payment;
import Ticket_Movie.demo.entity.Ticket;
import Ticket_Movie.demo.repository.BookingRepository;
import Ticket_Movie.demo.repository.PaymentRepository;
import Ticket_Movie.demo.service.PayOSService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingCleanupTask {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final PayOSService payOSService;

    /**
     * Chạy ngầm mỗi 3 giây trên Backend để tự động đối soát các giao dịch PayOS đang PENDING.
     * Khi PayOS báo status = "PAID", tự động chuyển đơn sang PAID, kích hoạt vé QR và gửi Email ngay lập tức.
     */
    @Scheduled(fixedDelay = 3000)
    public void syncPendingPayOSPayments() {
        try {
            List<Payment> pendingPayments = paymentRepository.findByStatus(Payment.Status.PENDING);
            for (Payment payment : pendingPayments) {
                if (payment.getTransactionId() != null && !payment.getTransactionId().isBlank() && payment.getBooking() != null) {
                    Integer bookingId = payment.getBooking().getBookingId();
                    try {
                        payOSService.checkPaymentStatus(bookingId);
                    } catch (Exception ignored) {
                    }
                }
            }
        } catch (Exception e) {
            log.debug("Lỗi nhẹ khi đồng bộ PayOS định kỳ: {}", e.getMessage());
        }
    }

    /**
     * Quét định kỳ mỗi 60 giây (1 phút) để tự động hủy các booking hết hạn giữ ghế
     * và nhả ghế lại cho khách hàng khác đặt (trừ các đơn đã thanh toán trên PayOS).
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cleanupExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> expiredBookings = bookingRepository.findByStatusAndExpiresAtBefore(Booking.Status.PENDING, now);

        if (!expiredBookings.isEmpty()) {
            for (Booking booking : expiredBookings) {
                // Kiểm tra lần cuối trên PayOS trước khi đánh dấu hết hạn để không hủy nhầm đơn đã chuyển tiền
                try {
                    Map<String, Object> payosCheck = payOSService.checkPaymentStatus(booking.getBookingId());
                    if (Boolean.TRUE.equals(payosCheck.get("paid"))) {
                        continue;
                    }
                } catch (Exception ignored) {
                }

                booking.setStatus(Booking.Status.EXPIRED);
                for (Ticket ticket : booking.getTickets()) {
                    ticket.setStatus(Ticket.Status.CANCELLED);
                }
                bookingRepository.save(booking);
            }
        }
    }
}
