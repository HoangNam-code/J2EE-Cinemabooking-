package Ticket_Movie.demo.service.impl;

import Ticket_Movie.demo.dto.response.SeatMapResponse;
import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.Room;
import Ticket_Movie.demo.entity.Seat;
import Ticket_Movie.demo.entity.Showtime;
import Ticket_Movie.demo.entity.Ticket;
import Ticket_Movie.demo.exception.ResourceNotFoundException;
import Ticket_Movie.demo.repository.SeatRepository;
import Ticket_Movie.demo.repository.ShowtimeRepository;
import Ticket_Movie.demo.repository.TicketRepository;
import Ticket_Movie.demo.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    @Override
    @Transactional
    public SeatMapResponse getSeatMapForShowtime(Integer showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy suất chiếu ID: " + showtimeId));

        Room room = showtime.getRoom();
        List<Seat> seats = seatRepository.findByRoomRoomIdOrderByRowNameAscSeatNumberAsc(room.getRoomId());
        if (seats.isEmpty()) {
            seats = generateDefaultSeats(room);
        }

        // Tìm tất cả các vé chưa hủy của suất chiếu này
        List<Ticket> activeTickets = ticketRepository.findByShowtimeShowtimeIdAndStatusNot(showtimeId, Ticket.Status.CANCELLED);

        // Map seatId -> Ticket status (BOOKED nếu PAID, HOLD nếu PENDING và chưa hết hạn)
        LocalDateTime now = LocalDateTime.now();
        Map<Integer, String> seatStatusMap = activeTickets.stream().collect(Collectors.toMap(
                t -> t.getSeat().getSeatId(),
                t -> {
                    Booking b = t.getBooking();
                    if (b.getStatus() == Booking.Status.PAID) {
                        return "BOOKED";
                    } else if (b.getStatus() == Booking.Status.PENDING && b.getExpiresAt() != null && b.getExpiresAt().isAfter(now)) {
                        return "HOLD";
                    }
                    return "FREE";
                },
                (status1, status2) -> {
                    if ("BOOKED".equals(status1) || "BOOKED".equals(status2)) return "BOOKED";
                    if ("HOLD".equals(status1) || "HOLD".equals(status2)) return "HOLD";
                    return "FREE";
                }
        ));

        List<SeatMapResponse.SeatItem> seatItems = new ArrayList<>();
        for (Seat seat : seats) {
            String status = seatStatusMap.getOrDefault(seat.getSeatId(), "FREE");
            if (seat.getStatus() != Seat.Status.ACTIVE) {
                status = "MAINTENANCE";
            }

            // Tính phụ thu giá theo loại ghế (VIP + 15,000 VND, COUPLE + 30,000 VND)
            BigDecimal seatPrice = showtime.getPrice();
            if (seat.getSeatType() == Seat.SeatType.VIP) {
                seatPrice = seatPrice.add(new BigDecimal("15000"));
            } else if (seat.getSeatType() == Seat.SeatType.COUPLE) {
                seatPrice = seatPrice.add(new BigDecimal("30000"));
            }

            seatItems.add(SeatMapResponse.SeatItem.builder()
                    .seatId(seat.getSeatId())
                    .seatCode(seat.getSeatCode())
                    .rowName(seat.getRowName())
                    .seatNumber(seat.getSeatNumber())
                    .seatType(seat.getSeatType().name())
                    .price(seatPrice)
                    .status(status)
                    .build());
        }

        return SeatMapResponse.builder()
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .roomType(room.getRoomType())
                .cinemaId(room.getCinema().getCinemaId())
                .cinemaName(room.getCinema().getCinemaName())
                .showtimeId(showtime.getShowtimeId())
                .basePrice(showtime.getPrice())
                .seats(seatItems)
                .build();
    }

    private List<Seat> generateDefaultSeats(Room room) {
        List<Seat> list = new ArrayList<>();
        // Cấu hình rạp tiêu chuẩn: 8 hàng A -> H (tổng 84 ghế)
        // Hàng A, B, C: Ghế thường (10 ghế mỗi hàng)
        // Hàng D, E, F: Ghế VIP (10 ghế mỗi hàng)
        // Hàng G: Ghế VIP (12 ghế)
        // Hàng H: Ghế Couple đôi (6 ghế đôi tương đương 12 chỗ)
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H"};
        for (String r : rows) {
            Seat.SeatType type;
            int count;
            if ("H".equals(r)) {
                type = Seat.SeatType.COUPLE;
                count = 6; // 6 ghế đôi
            } else if ("D".equals(r) || "E".equals(r) || "F".equals(r) || "G".equals(r)) {
                type = Seat.SeatType.VIP;
                count = "G".equals(r) ? 12 : 10;
            } else {
                type = Seat.SeatType.NORMAL;
                count = 10;
            }

            for (int i = 1; i <= count; i++) {
                String code = String.format("%s%02d", r, i);
                list.add(Seat.builder()
                        .room(room)
                        .seatCode(code)
                        .rowName(r)
                        .seatNumber(i)
                        .seatType(type)
                        .status(Seat.Status.ACTIVE)
                        .build());
            }
        }
        return seatRepository.saveAll(list);
    }
}
