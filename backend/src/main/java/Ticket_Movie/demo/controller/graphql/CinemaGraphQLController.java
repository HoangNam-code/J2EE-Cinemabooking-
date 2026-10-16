package Ticket_Movie.demo.controller.graphql;

import Ticket_Movie.demo.dto.response.BookingSummaryResponse;
import Ticket_Movie.demo.dto.response.MovieDetailResponse;
import Ticket_Movie.demo.dto.response.SeatMapResponse;
import Ticket_Movie.demo.dto.response.ShowtimeResponse;
import Ticket_Movie.demo.entity.Food;
import Ticket_Movie.demo.repository.FoodRepository;
import Ticket_Movie.demo.service.BookingService;
import Ticket_Movie.demo.service.MovieService;
import Ticket_Movie.demo.service.SeatService;
import Ticket_Movie.demo.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;
import java.util.List;

/**
 * GraphQL Controller phục vụ đề tài Seminar: Spring for GraphQL
 * Cung cấp khả năng truy vấn linh hoạt (Flexible Querying), giải quyết triệt để
 * vấn đề Over-fetching và Under-fetching so với RESTful API truyền thống.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class CinemaGraphQLController {

    private final MovieService movieService;
    private final ShowtimeService showtimeService;
    private final SeatService seatService;
    private final BookingService bookingService;
    private final FoodRepository foodRepository;

    // ==========================================
    // 1. Phim (Movies Queries)
    // ==========================================

    @QueryMapping
    public List<MovieDetailResponse> movies() {
        return movieService.getAllMovies();
    }

    @QueryMapping
    public List<MovieDetailResponse> nowShowingMovies() {
        return movieService.getNowShowing();
    }

    @QueryMapping
    public List<MovieDetailResponse> comingSoonMovies() {
        return movieService.getComingSoon();
    }

    @QueryMapping
    public MovieDetailResponse movieById(@Argument Integer id) {
        return movieService.getMovieById(id);
    }

    @QueryMapping
    public List<MovieDetailResponse> searchMovies(@Argument String query) {
        return movieService.searchMovies(query);
    }

    // ==========================================
    // 2. Suất Chiếu & Sơ Đồ Ghế (Showtimes & Seats)
    // ==========================================

    @QueryMapping
    public List<ShowtimeResponse> showtimesByMovie(@Argument Integer movieId, @Argument String date) {
        if (date != null && !date.trim().isEmpty()) {
            try {
                LocalDate localDate = LocalDate.parse(date.trim());
                return showtimeService.getShowtimesByMovieAndDate(movieId, localDate);
            } catch (Exception e) {
                log.warn("Invalid date format in GraphQL query: {}", date);
            }
        }
        return showtimeService.getShowtimesByMovie(movieId);
    }

    @QueryMapping
    public ShowtimeResponse showtimeById(@Argument Integer id) {
        return showtimeService.getShowtimeResponseById(id);
    }

    @QueryMapping
    public SeatMapResponse seatMap(@Argument Integer showtimeId) {
        return seatService.getSeatMapForShowtime(showtimeId);
    }

    // ==========================================
    // 3. Menu Bắp Nước (Foods)
    // ==========================================

    @QueryMapping
    public List<Food> foods() {
        return foodRepository.findByStatus(Food.Status.ACTIVE);
    }

    // ==========================================
    // 4. Đơn Đặt Vé (Bookings)
    // ==========================================

    @QueryMapping
    public BookingSummaryResponse bookingSummary(@Argument Integer bookingId) {
        return bookingService.getBookingSummary(bookingId);
    }

    @MutationMapping
    public Boolean cancelBooking(@Argument Integer bookingId) {
        try {
            // Hủy đơn đặt vé thông qua bookingService
            bookingService.cancelBooking(bookingId, null);
            return true;
        } catch (Exception e) {
            log.error("Lỗi hủy đơn vé qua GraphQL mutation: {}", e.getMessage());
            return false;
        }
    }
}
