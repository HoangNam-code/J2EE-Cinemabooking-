package Ticket_Movie.demo.repository;

import Ticket_Movie.demo.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByBookingBookingId(Integer bookingId);
    Optional<Payment> findByTransactionId(String transactionId);
}
