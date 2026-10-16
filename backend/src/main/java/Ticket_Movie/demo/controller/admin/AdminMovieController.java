package Ticket_Movie.demo.controller.admin;

import Ticket_Movie.demo.dto.request.MovieCreateRequest;
import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.dto.response.MovieDetailResponse;
import Ticket_Movie.demo.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/movies")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
@Tag(name = "Admin Movies", description = "Quản lý phim (Admin & Staff)")
public class AdminMovieController {

    private final MovieService movieService;

    @PostMapping
    @Operation(summary = "Thêm phim mới vào rạp")
    public ResponseEntity<ApiResponse<MovieDetailResponse>> createMovie(@Valid @RequestBody MovieCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Thêm phim mới thành công", movieService.createMovie(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin phim")
    public ResponseEntity<ApiResponse<MovieDetailResponse>> updateMovie(
            @PathVariable Integer id,
            @Valid @RequestBody MovieCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật phim thành công", movieService.updateMovie(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa một bộ phim")
    public ResponseEntity<ApiResponse<String>> deleteMovie(@PathVariable Integer id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phim thành công", null));
    }
}
