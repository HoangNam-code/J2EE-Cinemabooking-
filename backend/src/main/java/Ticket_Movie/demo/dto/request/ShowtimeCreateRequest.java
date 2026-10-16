package Ticket_Movie.demo.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ShowtimeCreateRequest {
    @NotNull(message = "MovieId không được để trống")
    private Integer movieId;

    @NotNull(message = "RoomId không được để trống")
    private Integer roomId;

    @NotNull(message = "Ngày chiếu không được để trống")
    private LocalDate showDate;

    @NotNull(message = "Giờ bắt đầu không được để trống")
    private LocalTime startTime;

    private LocalTime endTime;

    private String format; // 2D, 3D, IMAX, DOLBY

    @NotNull(message = "Giá vé không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá vé phải lớn hơn 0")
    private BigDecimal price;
}
