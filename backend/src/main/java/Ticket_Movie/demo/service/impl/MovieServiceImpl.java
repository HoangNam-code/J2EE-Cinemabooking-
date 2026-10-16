package Ticket_Movie.demo.service.impl;

import Ticket_Movie.demo.dto.request.MovieCreateRequest;
import Ticket_Movie.demo.dto.response.MovieDetailResponse;
import Ticket_Movie.demo.entity.Category;
import Ticket_Movie.demo.entity.Movie;
import Ticket_Movie.demo.exception.ResourceNotFoundException;
import Ticket_Movie.demo.repository.CategoryRepository;
import Ticket_Movie.demo.repository.MovieRepository;
import Ticket_Movie.demo.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<MovieDetailResponse> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieDetailResponse> getNowShowing() {
        return movieRepository.findByStatus(Movie.Status.NOW_SHOWING).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieDetailResponse> getComingSoon() {
        return movieRepository.findByStatus(Movie.Status.COMING_SOON).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MovieDetailResponse getMovieById(Integer movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có ID: " + movieId));
        return mapToResponse(movie);
    }

    @Override
    public List<MovieDetailResponse> searchMovies(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllMovies();
        }
        return movieRepository.searchMovies(query.trim()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MovieDetailResponse createMovie(MovieCreateRequest request) {
        Movie movie = Movie.builder()
                .movieName(request.getMovieName())
                .duration(request.getDuration())
                .director(request.getDirector())
                .actors(request.getActors())
                .description(request.getDescription())
                .releaseDate(request.getReleaseDate())
                .endDate(request.getEndDate())
                .posterUrl(request.getPosterUrl())
                .trailerUrl(request.getTrailerUrl())
                .status(request.getStatus() != null ? Movie.Status.valueOf(request.getStatus()) : Movie.Status.COMING_SOON)
                .build();

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            movie.setCategories(categories);
        }

        movie = movieRepository.save(movie);
        return mapToResponse(movie);
    }

    @Override
    @Transactional
    public MovieDetailResponse updateMovie(Integer movieId, MovieCreateRequest request) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim có ID: " + movieId));

        movie.setMovieName(request.getMovieName());
        movie.setDuration(request.getDuration());
        movie.setDirector(request.getDirector());
        movie.setActors(request.getActors());
        movie.setDescription(request.getDescription());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setEndDate(request.getEndDate());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        if (request.getStatus() != null) {
            movie.setStatus(Movie.Status.valueOf(request.getStatus()));
        }

        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            movie.setCategories(categories);
        }

        movie = movieRepository.save(movie);
        return mapToResponse(movie);
    }

    @Override
    @Transactional
    public void deleteMovie(Integer movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new ResourceNotFoundException("Không tìm thấy phim có ID: " + movieId);
        }
        movieRepository.deleteById(movieId);
    }

    private MovieDetailResponse mapToResponse(Movie movie) {
        List<String> categoryNames = movie.getCategories() != null
                ? movie.getCategories().stream().map(Category::getCategoryName).collect(Collectors.toList())
                : List.of();

        return MovieDetailResponse.builder()
                .movieId(movie.getMovieId())
                .movieName(movie.getMovieName())
                .duration(movie.getDuration())
                .director(movie.getDirector())
                .actors(movie.getActors())
                .description(movie.getDescription())
                .releaseDate(movie.getReleaseDate())
                .endDate(movie.getEndDate())
                .posterUrl(movie.getPosterUrl())
                .trailerUrl(movie.getTrailerUrl())
                .status(movie.getStatus().name())
                .categories(categoryNames)
                .build();
    }
}
