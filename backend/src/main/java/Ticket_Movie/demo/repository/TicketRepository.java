package Ticket_Movie.demo.repository;

import Ticket_Movie.demo.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    List<Ticket> findByShowtimeShowtimeIdAndStatusNot(Integer showtimeId, Ticket.Status status);
    List<Ticket> findByBookingBookingId(Integer bookingId);
    java.util.Optional<Ticket> findByQrCode(String qrCode);

    @Query("SELECT t.seat.seatId FROM Ticket t WHERE t.showtime.showtimeId = :showtimeId AND t.status <> 'CANCELLED'")
    List<Integer> findBookedSeatIdsByShowtime(@Param("showtimeId") Integer showtimeId);

    @Query("SELECT COUNT(t) > 0 FROM Ticket t WHERE t.showtime.showtimeId = :showtimeId AND t.seat.seatId IN :seatIds AND t.status <> 'CANCELLED'")
    boolean existsActiveTicketsForSeats(@Param("showtimeId") Integer showtimeId, @Param("seatIds") List<Integer> seatIds);
}
