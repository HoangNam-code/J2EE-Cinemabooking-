package Ticket_Movie.demo.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSummaryResponse {
    private Integer bookingId;
    private String status;
    private LocalDateTime bookingDate;
    private LocalDateTime expiresAt;
    private Long remainingSeconds;

    // Phim & Suất chiếu
    private Integer movieId;
    private String movieName;
    private String posterUrl;
    private String cinemaName;
    private String roomName;
    private String showDate;
    private String startTime;

    // Chi tiết ghế
    private List<TicketItem> tickets;
    private BigDecimal ticketSubtotal;

    // Chi tiết bắp nước
    private List<FoodItem> foods;
    private BigDecimal foodSubtotal;

    // Khuyến mãi & Tổng tiền
    private String promotionCode;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TicketItem {
        private Integer ticketId;
        private Integer seatId;
        private String seatCode;
        private String seatType;
        private BigDecimal price;
        private String qrCode;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FoodItem {
        private Integer foodId;
        private String foodName;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal subtotal;
    }
}
