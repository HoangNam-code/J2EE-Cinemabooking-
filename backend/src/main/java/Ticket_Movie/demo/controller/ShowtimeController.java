package Ticket_Movie.demo.controller;

import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.dto.response.SeatMapResponse;
import Ticket_Movie.demo.dto.response.ShowtimeResponse;
import Ticket_Movie.demo.service.SeatService;
import Ticket_Movie.demo.service.ShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/showtimes")
@RequiredArgsConstructor
@Tag(name = "Showtimes", description = "Các API lịch chiếu và sơ đồ ghế")
public class ShowtimeController {

    private final ShowtimeService showtimeService;
    private final SeatService seatService;

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Lấy lịch chiếu theo ID phim (có thể lọc theo ngày)")
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>> getByMovie(
            @PathVariable Integer movieId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date != null) {
            return ResponseEntity.ok(ApiResponse.success(showtimeService.getShowtimesByMovieAndDate(movieId, date)));
        }
        return ResponseEntity.ok(ApiResponse.success(showtimeService.getShowtimesByMovie(movieId)));
    }

    @GetMapping("/date/{date}")
    @Operation(summary = "Lấy lịch chiếu của tất cả các rạp theo ngày cụ thể (YYYY-MM-DD)")
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(showtimeService.getShowtimesByDate(date)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết một suất chiếu")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(showtimeService.getShowtimeResponseById(id)));
    }

    @GetMapping("/{id}/seats")
    @Operation(summary = "Lấy sơ đồ ghế kèm trạng thái (FREE / HOLD / BOOKED) của suất chiếu")
    public ResponseEntity<ApiResponse<SeatMapResponse>> getSeatMap(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(seatService.getSeatMapForShowtime(id)));
    }
}
