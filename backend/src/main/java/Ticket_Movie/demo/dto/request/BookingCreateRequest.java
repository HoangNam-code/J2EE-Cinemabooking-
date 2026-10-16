package Ticket_Movie.demo.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookingCreateRequest {
    @NotNull(message = "ShowtimeId không được để trống")
    private Integer showtimeId;

    @NotEmpty(message = "Phải chọn ít nhất một ghế")
    private List<Integer> seatIds;

    private List<FoodOrderRequest> foods;

    private String promotionCode;

    @Getter
    @Setter
    public static class FoodOrderRequest {
        @NotNull
        private Integer foodId;
        @NotNull
        private Integer quantity;
    }
}
