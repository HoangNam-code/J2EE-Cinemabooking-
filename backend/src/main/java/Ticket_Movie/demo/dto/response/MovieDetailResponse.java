package Ticket_Movie.demo.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDetailResponse {
    private Integer movieId;
    private String movieName;
    private Integer duration;
    private String director;
    private String actors;
    private String description;
    private LocalDate releaseDate;
    private LocalDate endDate;
    private String posterUrl;
    private String trailerUrl;
    private String status;
    private List<String> categories;
}
