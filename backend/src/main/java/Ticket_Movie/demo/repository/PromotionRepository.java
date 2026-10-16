package Ticket_Movie.demo.repository;

import Ticket_Movie.demo.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
    Optional<Promotion> findByPromotionCodeAndStatus(String promotionCode, Promotion.Status status);
    Optional<Promotion> findByPromotionCode(String promotionCode);
}
