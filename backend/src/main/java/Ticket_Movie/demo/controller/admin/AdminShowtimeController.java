package Ticket_Movie.demo.controller.admin;

import Ticket_Movie.demo.dto.request.ShowtimeCreateRequest;
import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.dto.response.ShowtimeResponse;
import Ticket_Movie.demo.service.ShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/showtimes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
@Tag(name = "Admin Showtimes", description = "Quản lý xếp lịch chiếu (Admin & Staff)")
public class AdminShowtimeController {

    private final ShowtimeService showtimeService;

    @PostMapping
    @Operation(summary = "Tạo suất chiếu mới (Có kiểm tra chống trùng lịch trong cùng phòng)")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> createShowtime(@Valid @RequestBody ShowtimeCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Xếp lịch chiếu thành công", showtimeService.createShowtime(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật suất chiếu")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> updateShowtime(
            @PathVariable Integer id,
            @Valid @RequestBody ShowtimeCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật suất chiếu thành công", showtimeService.updateShowtime(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Hủy suất chiếu")
    public ResponseEntity<ApiResponse<String>> deleteShowtime(@PathVariable Integer id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.ok(ApiResponse.success("Hủy suất chiếu thành công", null));
    }
}
