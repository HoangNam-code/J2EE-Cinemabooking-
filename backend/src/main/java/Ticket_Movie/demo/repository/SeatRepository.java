package Ticket_Movie.demo.repository;

import Ticket_Movie.demo.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Integer> {
    List<Seat> findByRoomRoomIdOrderByRowNameAscSeatNumberAsc(Integer roomId);
    List<Seat> findBySeatIdIn(List<Integer> seatIds);
}
