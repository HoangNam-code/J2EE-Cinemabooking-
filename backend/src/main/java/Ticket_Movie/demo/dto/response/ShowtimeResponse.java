package Ticket_Movie.demo.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeResponse {
    private Integer showtimeId;
    private Integer movieId;
    private String movieName;
    private String posterUrl;
    private Integer roomId;
    private String roomName;
    private String roomType;
    private Integer cinemaId;
    private String cinemaName;
    private String cinemaAddress;
    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String format;
    private BigDecimal price;
    private String status;

    private RoomInfo room;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoomInfo {
        private Integer roomId;
        private String roomName;
        private String roomType;
        private CinemaInfo cinema;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CinemaInfo {
        private Integer cinemaId;
        private String cinemaName;
        private String address;
    }
}
