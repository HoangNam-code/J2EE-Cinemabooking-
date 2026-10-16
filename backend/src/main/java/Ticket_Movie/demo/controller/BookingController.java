package Ticket_Movie.demo.controller;

import Ticket_Movie.demo.dto.request.BookingCreateRequest;
import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.dto.response.BookingSummaryResponse;
import Ticket_Movie.demo.entity.User;
import Ticket_Movie.demo.service.BookingService;
import Ticket_Movie.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Các API giữ ghế, thanh toán và quản lý đơn đặt vé")
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    @PostMapping("/hold")
    @Operation(summary = "Tạo đơn giữ ghế tạm thời (10 phút) kèm bắp nước và mã giảm giá")
    public ResponseEntity<ApiResponse<BookingSummaryResponse>> createHoldBooking(
            @Valid @RequestBody BookingCreateRequest request) {
        User currentUser = userService.getCurrentUser();
        BookingSummaryResponse response = bookingService.createHoldBooking(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Giữ ghế thành công! Vui lòng thanh toán trong thời hạn", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem tóm tắt thông tin đơn đặt vé và đồng hồ đếm ngược thời gian giữ ghế")
    public ResponseEntity<ApiResponse<BookingSummaryResponse>> getBookingSummary(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingSummary(id)));
    }

    @GetMapping("/my-bookings")
    @Operation(summary = "Xem lịch sử đặt vé của tài khoản đang đăng nhập")
    public ResponseEntity<ApiResponse<List<BookingSummaryResponse>>> getMyBookings() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(bookingService.getUserBookings(currentUser.getUserId())));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Hủy đơn đặt vé trước khi thanh toán")
    public ResponseEntity<ApiResponse<String>> cancelBooking(@PathVariable Integer id) {
        User currentUser = userService.getCurrentUser();
        bookingService.cancelBooking(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Hủy đơn đặt vé thành công", null));
    }
}
