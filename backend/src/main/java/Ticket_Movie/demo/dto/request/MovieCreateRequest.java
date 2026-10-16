package Ticket_Movie.demo.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class MovieCreateRequest {
    @NotBlank(message = "Tên phim không được để trống")
    private String movieName;

    @NotNull(message = "Thời lượng không được để trống")
    @Min(value = 1, message = "Thời lượng phải lớn hơn 0")
    private Integer duration;

    private String director;
    private String actors;
    private String description;
    private LocalDate releaseDate;
    private LocalDate endDate;
    private String posterUrl;
    private String trailerUrl;
    private String status; // COMING_SOON, NOW_SHOWING, ENDED

    private List<Integer> categoryIds;
}
