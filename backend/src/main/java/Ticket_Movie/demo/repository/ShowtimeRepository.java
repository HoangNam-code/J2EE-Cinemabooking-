package Ticket_Movie.demo.repository;

import Ticket_Movie.demo.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Integer> {
    List<Showtime> findByMovieMovieIdAndShowDateAndStatus(Integer movieId, LocalDate showDate, Showtime.Status status);
    List<Showtime> findByMovieMovieIdAndStatus(Integer movieId, Showtime.Status status);
    List<Showtime> findByShowDateAndStatus(LocalDate showDate, Showtime.Status status);
    List<Showtime> findByRoomRoomIdAndShowDate(Integer roomId, LocalDate showDate);
}
