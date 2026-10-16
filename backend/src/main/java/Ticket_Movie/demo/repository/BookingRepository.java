package Ticket_Movie.demo.repository;

import Ticket_Movie.demo.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserUserIdOrderByCreatedAtDesc(Integer userId);
    List<Booking> findByStatusAndExpiresAtBefore(Booking.Status status, LocalDateTime dateTime);

    @Query("SELECT b FROM Booking b WHERE b.status = :status")
    List<Booking> findByStatus(@Param("status") Booking.Status status);
}
