package Ticket_Movie.demo.service;

import Ticket_Movie.demo.dto.request.ShowtimeCreateRequest;
import Ticket_Movie.demo.dto.response.ShowtimeResponse;
import Ticket_Movie.demo.entity.Showtime;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeService {
    List<ShowtimeResponse> getShowtimesByMovieAndDate(Integer movieId, LocalDate date);
    List<ShowtimeResponse> getShowtimesByMovie(Integer movieId);
    List<ShowtimeResponse> getShowtimesByDate(LocalDate date);
    ShowtimeResponse getShowtimeResponseById(Integer showtimeId);
    Showtime getShowtimeEntityById(Integer showtimeId);

    ShowtimeResponse createShowtime(ShowtimeCreateRequest request);
    ShowtimeResponse updateShowtime(Integer showtimeId, ShowtimeCreateRequest request);
    void deleteShowtime(Integer showtimeId);
}
