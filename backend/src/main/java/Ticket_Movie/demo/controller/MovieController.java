package Ticket_Movie.demo.controller;

import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.dto.response.MovieDetailResponse;
import Ticket_Movie.demo.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
@RequiredArgsConstructor
@Tag(name = "Movies", description = "Các API tra cứu phim công khai")
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    @Operation(summary = "Lấy tất cả phim trong hệ thống")
    public ResponseEntity<ApiResponse<List<MovieDetailResponse>>> getAllMovies() {
        return ResponseEntity.ok(ApiResponse.success(movieService.getAllMovies()));
    }

    @GetMapping("/now-showing")
    @Operation(summary = "Lấy danh sách phim đang chiếu")
    public ResponseEntity<ApiResponse<List<MovieDetailResponse>>> getNowShowing() {
        return ResponseEntity.ok(ApiResponse.success(movieService.getNowShowing()));
    }

    @GetMapping("/coming-soon")
    @Operation(summary = "Lấy danh sách phim sắp chiếu")
    public ResponseEntity<ApiResponse<List<MovieDetailResponse>>> getComingSoon() {
        return ResponseEntity.ok(ApiResponse.success(movieService.getComingSoon()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết một bộ phim theo ID")
    public ResponseEntity<ApiResponse<MovieDetailResponse>> getMovieById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(movieService.getMovieById(id)));
    }

    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm phim theo tên hoặc thể loại")
    public ResponseEntity<ApiResponse<List<MovieDetailResponse>>> searchMovies(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(ApiResponse.success(movieService.searchMovies(q)));
    }
}
