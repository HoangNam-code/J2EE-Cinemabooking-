package Ticket_Movie.demo.controller;

import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.entity.*;
import Ticket_Movie.demo.exception.AppException;
import Ticket_Movie.demo.exception.ResourceNotFoundException;
import Ticket_Movie.demo.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller dành riêng cho Nhân viên rạp (Role: STAFF & ADMIN)
 * Cung cấp các chức năng thực thi vận hành hàng ngày:
 * 1. Soát vé điện tử & Quét Check-in QR Code.
 * 2. Quản lý kho Bắp - Nước tại quầy (Bật / Tắt trạng thái Còn hàng - Hết hàng).
 * 3. Quản lý sơ đồ ghế phòng chiếu (Khóa ghế hỏng / Bảo trì / Mở lại phục vụ).
 */
@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
@Tag(name = "Staff Operations", description = "Các API vận hành dành cho Nhân viên rạp (Soát vé, Quản lý kho Bắp nước, Khóa ghế bảo trì)")
public class StaffController {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final FoodRepository foodRepository;
    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;

    // ==========================================
    // 1. NGHIỆP VỤ SOÁT VÉ & CHECK-IN QR
    // ==========================================

    @GetMapping("/check-ticket")
    @Operation(summary = "Kiểm tra chi tiết vé theo mã QR Code hoặc Mã Đặt Vé")
    public ResponseEntity<ApiResponse<CheckInTicketResponse>> inspectTicket(@RequestParam String code) {
        CheckInTicketResponse response = buildTicketResponse(code.trim());
        return ResponseEntity.ok(ApiResponse.success("Kiểm tra thông tin vé thành công", response));
    }

    @PostMapping("/check-in")
    @Transactional
    @Operation(summary = "Xác nhận Check-in vé cho khách vào rạp (Đổi trạng thái VALID -> USED)")
    public ResponseEntity<ApiResponse<CheckInTicketResponse>> checkInTicket(@RequestParam String code) {
        String queryCode = code.trim();

        // 1. Thử tìm theo mã vé QR Code
        Ticket ticket = ticketRepository.findByQrCode(queryCode).orElse(null);
        if (ticket != null) {
            if (ticket.getStatus() == Ticket.Status.USED) {
                throw new AppException(400, "Vé này đã được quét sử dụng trước đó!");
            }
            if (ticket.getStatus() == Ticket.Status.CANCELLED) {
                throw new AppException(400, "Vé này đã bị hủy, không hợp lệ!");
            }
            if (ticket.getBooking().getStatus() != Booking.Status.PAID) {
                throw new AppException(400, "Đơn đặt vé này chưa được thanh toán!");
            }

            ticket.setStatus(Ticket.Status.USED);
            ticketRepository.save(ticket);
            return ResponseEntity.ok(ApiResponse.success("✓ Check-in vé thành công! Mời khách vào phòng chiếu.", buildTicketResponse(queryCode)));
        }

        // 2. Thử tìm theo mã đơn BookingRef / ID
        Booking booking = findBookingByCode(queryCode);
        if (booking == null) {
            throw new ResourceNotFoundException("Không tìm thấy vé hoặc đơn đặt chỗ với mã: " + queryCode);
        }

        if (booking.getStatus() != Booking.Status.PAID) {
            throw new AppException(400, "Đơn đặt chỗ #" + booking.getBookingRef() + " chưa thanh toán!");
        }

        boolean hasValid = false;
        for (Ticket t : booking.getTickets()) {
            if (t.getStatus() == Ticket.Status.VALID) {
                t.setStatus(Ticket.Status.USED);
                hasValid = true;
            }
        }

        if (!hasValid) {
            throw new AppException(400, "Toàn bộ vé trong đơn hàng này đã được check-in trước đó hoặc đã bị hủy!");
        }

        bookingRepository.save(booking);
        return ResponseEntity.ok(ApiResponse.success("✓ Check-in toàn bộ vé trong đơn thành công!", buildTicketResponse(queryCode)));
    }

    // ==========================================
    // 2. QUẢN LÝ KHO BẮP - NƯỚC (QUẦY CĂNG TIN RẠP)
    // ==========================================

    @GetMapping("/foods")
    @Operation(summary = "Lấy danh sách tất cả món bắp nước kèm trạng thái Còn hàng / Hết hàng")
    public ResponseEntity<ApiResponse<List<Food>>> getAllFoodsForStaff() {
        List<Food> foods = foodRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(foods));
    }

    @PutMapping("/foods/{foodId}/toggle")
    @Operation(summary = "Nhân viên bật / tắt nhanh trạng thái Còn hàng (ACTIVE) hoặc Hết hàng (INACTIVE)")
    public ResponseEntity<ApiResponse<Food>> toggleFoodStatus(@PathVariable Integer foodId) {
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món bắp/nước với ID: " + foodId));

        if (food.getStatus() == Food.Status.ACTIVE) {
            food.setStatus(Food.Status.INACTIVE);
        } else {
            food.setStatus(Food.Status.ACTIVE);
        }
        foodRepository.save(food);

        String message = food.getStatus() == Food.Status.ACTIVE
                ? "Đã mở bán lại món: " + food.getFoodName()
                : "Đã đánh dấu hết hàng: " + food.getFoodName();

        return ResponseEntity.ok(ApiResponse.success(message, food));
    }

    @PutMapping("/foods/{foodId}/status")
    @Operation(summary = "Nhân viên cập nhật trạng thái bắp nước")
    public ResponseEntity<ApiResponse<Food>> updateFoodStatus(@PathVariable Integer foodId, @RequestParam Food.Status status) {
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy món bắp/nước với ID: " + foodId));

        food.setStatus(status);
        foodRepository.save(food);
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật trạng thái món bắp/nước thành công", food));
    }

    // ==========================================
    // 3. QUẢN LÝ SƠ ĐỒ GHẾ & KHÓA GHẾ BẢO TRÌ
    // ==========================================

    @GetMapping("/rooms")
    @Operation(summary = "Lấy danh sách các phòng chiếu kèm số lượng ghế bảo trì")
    public ResponseEntity<ApiResponse<List<StaffRoomResponse>>> getRoomsForStaff() {
        List<Room> rooms = roomRepository.findAll();
        List<StaffRoomResponse> result = rooms.stream().map(room -> {
            List<Seat> seats = seatRepository.findByRoomRoomIdOrderByRowNameAscSeatNumberAsc(room.getRoomId());
            long maintenanceCount = seats.stream().filter(s -> s.getStatus() == Seat.Status.MAINTENANCE).count();
            long inactiveCount = seats.stream().filter(s -> s.getStatus() == Seat.Status.INACTIVE).count();

            return StaffRoomResponse.builder()
                    .roomId(room.getRoomId())
                    .roomName(room.getRoomName())
                    .roomType(room.getRoomType())
                    .cinemaName(room.getCinema() != null ? room.getCinema().getCinemaName() : "CinePrime")
                    .totalSeats(seats.size())
                    .maintenanceSeats((int) maintenanceCount)
                    .inactiveSeats((int) inactiveCount)
                    .build();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/rooms/{roomId}/seats")
    @Operation(summary = "Lấy sơ đồ và trạng thái tất cả các ghế trong phòng chiếu")
    public ResponseEntity<ApiResponse<List<StaffSeatResponse>>> getRoomSeatsForStaff(@PathVariable Integer roomId) {
        List<Seat> seats = seatRepository.findByRoomRoomIdOrderByRowNameAscSeatNumberAsc(roomId);
        List<StaffSeatResponse> result = seats.stream().map(this::toSeatResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PutMapping("/seats/{seatId}/toggle-maintenance")
    @Operation(summary = "Nhân viên bật / tắt trạng thái bảo trì ghế (ACTIVE <-> MAINTENANCE)")
    public ResponseEntity<ApiResponse<StaffSeatResponse>> toggleSeatMaintenance(@PathVariable Integer seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ghế với ID: " + seatId));

        if (seat.getStatus() == Seat.Status.ACTIVE) {
            seat.setStatus(Seat.Status.MAINTENANCE);
        } else {
            seat.setStatus(Seat.Status.ACTIVE);
        }
        seatRepository.save(seat);

        String message = seat.getStatus() == Seat.Status.MAINTENANCE
                ? "Đã khóa ghế " + seat.getSeatCode() + " (Đưa vào bảo trì/hỏng)"
                : "Đã mở khóa ghế " + seat.getSeatCode() + " (Sẵn sàng phục vụ khách)";

        return ResponseEntity.ok(ApiResponse.success(message, toSeatResponse(seat)));
    }

    @PutMapping("/seats/{seatId}/status")
    @Operation(summary = "Nhân viên cập nhật trạng thái chi tiết của ghế (ACTIVE, MAINTENANCE, INACTIVE)")
    public ResponseEntity<ApiResponse<StaffSeatResponse>> updateSeatStatus(@PathVariable Integer seatId, @RequestParam Seat.Status status) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ghế với ID: " + seatId));

        seat.setStatus(status);
        seatRepository.save(seat);
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật trạng thái ghế " + seat.getSeatCode(), toSeatResponse(seat)));
    }

    private StaffSeatResponse toSeatResponse(Seat s) {
        return StaffSeatResponse.builder()
                .seatId(s.getSeatId())
                .seatCode(s.getSeatCode())
                .rowName(s.getRowName())
                .seatNumber(s.getSeatNumber())
                .seatType(s.getSeatType().name())
                .status(s.getStatus().name())
                .roomId(s.getRoom() != null ? s.getRoom().getRoomId() : null)
                .build();
    }

    private Booking findBookingByCode(String code) {
        if (code == null || code.trim().isEmpty()) return null;
        String clean = code.trim().toUpperCase().replace("BK", "");
        try {
            Integer id = Integer.parseInt(clean);
            return bookingRepository.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private CheckInTicketResponse buildTicketResponse(String code) {
        Ticket ticket = ticketRepository.findByQrCode(code).orElse(null);
        Booking booking;
        if (ticket != null) {
            booking = ticket.getBooking();
        } else {
            booking = findBookingByCode(code);
            if (booking == null) {
                throw new ResourceNotFoundException("Không tìm thấy vé hoặc đơn hàng với mã: " + code);
            }
        }

        Showtime showtime = booking.getShowtime();
        List<String> seats = booking.getTickets().stream()
                .map(t -> t.getSeat().getSeatCode() + " (" + t.getStatus().name() + ")")
                .collect(Collectors.toList());

        return CheckInTicketResponse.builder()
                .bookingRef(booking.getBookingRef())
                .customerName(booking.getUser() != null ? booking.getUser().getFullName() : "Khách lẻ")
                .customerEmail(booking.getUser() != null ? booking.getUser().getEmail() : "")
                .customerPhone(booking.getUser() != null ? booking.getUser().getPhone() : "")
                .movieName(showtime != null && showtime.getMovie() != null ? showtime.getMovie().getMovieName() : "N/A")
                .cinemaName(showtime != null && showtime.getRoom() != null && showtime.getRoom().getCinema() != null ? showtime.getRoom().getCinema().getCinemaName() : "N/A")
                .roomName(showtime != null && showtime.getRoom() != null ? showtime.getRoom().getRoomName() : "N/A")
                .showDate(showtime != null && showtime.getShowDate() != null ? showtime.getShowDate().toString() : "")
                .startTime(showtime != null && showtime.getStartTime() != null ? showtime.getStartTime().toString().substring(0, 5) : "")
                .format(showtime != null ? showtime.getFormat() : "2D")
                .seats(seats)
                .bookingStatus(booking.getStatus().name())
                .totalAmount(booking.getTotalAmount() != null ? booking.getTotalAmount().doubleValue() : 0.0)
                .isAllUsed(booking.getTickets().stream().allMatch(t -> t.getStatus() == Ticket.Status.USED))
                .build();
    }

    // ==========================================
    // DTOs
    // ==========================================

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckInTicketResponse {
        private String bookingRef;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String movieName;
        private String cinemaName;
        private String roomName;
        private String showDate;
        private String startTime;
        private String format;
        private List<String> seats;
        private String bookingStatus;
        private double totalAmount;
        private boolean isAllUsed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StaffRoomResponse {
        private Integer roomId;
        private String roomName;
        private String roomType;
        private String cinemaName;
        private int totalSeats;
        private int maintenanceSeats;
        private int inactiveSeats;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StaffSeatResponse {
        private Integer seatId;
        private String seatCode;
        private String rowName;
        private Integer seatNumber;
        private String seatType;
        private String status;
        private Integer roomId;
    }
}
