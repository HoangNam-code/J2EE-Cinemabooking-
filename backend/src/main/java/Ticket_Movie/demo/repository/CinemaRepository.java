package Ticket_Movie.demo.repository;

import Ticket_Movie.demo.entity.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, Integer> {
    List<Cinema> findByStatus(Cinema.Status status);
}
