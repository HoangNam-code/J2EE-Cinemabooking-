package Ticket_Movie.demo.repository;

import Ticket_Movie.demo.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {
    List<Room> findByCinemaCinemaId(Integer cinemaId);
}
