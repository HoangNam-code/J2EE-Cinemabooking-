package Ticket_Movie.demo.service;

import Ticket_Movie.demo.dto.request.MovieCreateRequest;
import Ticket_Movie.demo.dto.response.MovieDetailResponse;
import Ticket_Movie.demo.entity.Movie;

import java.util.List;

public interface MovieService {
    List<MovieDetailResponse> getAllMovies();
    List<MovieDetailResponse> getNowShowing();
    List<MovieDetailResponse> getComingSoon();
    MovieDetailResponse getMovieById(Integer movieId);
    List<MovieDetailResponse> searchMovies(String query);

    MovieDetailResponse createMovie(MovieCreateRequest request);
    MovieDetailResponse updateMovie(Integer movieId, MovieCreateRequest request);
    void deleteMovie(Integer movieId);
}
