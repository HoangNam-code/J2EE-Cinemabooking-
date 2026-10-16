package Ticket_Movie.demo.repository;

import Ticket_Movie.demo.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {
    List<Movie> findByStatus(Movie.Status status);

    @Query("SELECT DISTINCT m FROM Movie m JOIN m.categories c WHERE LOWER(m.movieName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Movie> searchMovies(@Param("query") String query);
}
