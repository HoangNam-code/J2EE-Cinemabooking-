package Ticket_Movie.demo.controller.admin;

import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.Ticket;
import Ticket_Movie.demo.repository.BookingRepository;
import Ticket_Movie.demo.repository.MovieRepository;
import Ticket_Movie.demo.repository.TicketRepository;
import Ticket_Movie.demo.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/stats")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
@Tag(name = "Admin Stats", description = "Báo cáo thống kê doanh thu và vé bán")
public class AdminStatsController {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Lấy báo cáo tổng hợp: doanh thu, tổng số vé, người dùng và phim")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        List<Booking> paidBookings = bookingRepository.findByStatus(Booking.Status.PAID);

        BigDecimal totalRevenue = paidBookings.stream()
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalTicketsSold = paidBookings.stream()
                .mapToLong(b -> b.getTickets().size())
                .sum();

        long totalMovies = movieRepository.count();
        long totalUsers = userRepository.count();

        DashboardStatsResponse stats = DashboardStatsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalTicketsSold(totalTicketsSold)
                .totalBookings(paidBookings.size())
                .totalMovies(totalMovies)
                .totalUsers(totalUsers)
                .build();

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @Getter
    @Setter
    @Builder
    public static class DashboardStatsResponse {
        private BigDecimal totalRevenue;
        private long totalTicketsSold;
        private long totalBookings;
        private long totalMovies;
        private long totalUsers;
    }
}
