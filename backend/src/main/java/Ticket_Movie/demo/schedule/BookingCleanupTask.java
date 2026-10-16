package Ticket_Movie.demo.schedule;

import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.Ticket;
import Ticket_Movie.demo.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingCleanupTask {

    private final BookingRepository bookingRepository;

    /**
     * Quét định kỳ mỗi 60 giây (1 phút) để tự động hủy các booking hết hạn giữ ghế
     * và nhả ghế lại cho khách hàng khác đặt
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cleanupExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Booking> expiredBookings = bookingRepository.findByStatusAndExpiresAtBefore(Booking.Status.PENDING, now);

        if (!expiredBookings.isEmpty()) {
            log.info("Phát hiện {} đơn hàng hết hạn giữ ghế, đang tiến hành hủy và nhả ghế...", expiredBookings.size());
            for (Booking booking : expiredBookings) {
                booking.setStatus(Booking.Status.EXPIRED);
                for (Ticket ticket : booking.getTickets()) {
                    ticket.setStatus(Ticket.Status.CANCELLED);
                }
            }
            bookingRepository.saveAll(expiredBookings);
            log.info("Đã hủy và nhả ghế thành công cho {} đơn hàng.", expiredBookings.size());
        }
    }
}
