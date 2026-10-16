package Ticket_Movie.demo.controller;

import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.Showtime;
import Ticket_Movie.demo.entity.Ticket;
import Ticket_Movie.demo.exception.AppException;
import Ticket_Movie.demo.exception.ResourceNotFoundException;
import Ticket_Movie.demo.repository.BookingRepository;
import Ticket_Movie.demo.repository.TicketRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller dành cho Nhân viên soát vé tại rạp (Role: STAFF & ADMIN)
 * Cung cấp chức năng kiểm tra vé, check-in QR Code tại cổng rạp.
 */
@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
@Tag(name = "Staff Operations", description = "Các API dành riêng cho Nhân viên rạp (Soát vé & Check-in QR)")
public class StaffController {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;

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

    @Data
    @Builder
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
}
