package Ticket_Movie.demo.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatMapResponse {
    private Integer roomId;
    private String roomName;
    private String roomType;
    private Integer cinemaId;
    private String cinemaName;
    private Integer showtimeId;
    private BigDecimal basePrice;
    private List<SeatItem> seats;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SeatItem {
        private Integer seatId;
        private String seatCode;
        private String rowName;
        private Integer seatNumber;
        private String seatType; // NORMAL, VIP, COUPLE
        private BigDecimal price;
        private String status; // FREE, HOLD, BOOKED
    }
}
