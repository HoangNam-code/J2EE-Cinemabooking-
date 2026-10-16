package Ticket_Movie.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PromotionID")
    private Integer promotionId;

    @Column(name = "PromotionCode", nullable = false, unique = true, length = 50)
    private String promotionCode;

    @Column(name = "PromotionName", nullable = false, length = 200)
    private String promotionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "DiscountType", nullable = false)
    private DiscountType discountType;

    @Column(name = "DiscountValue", nullable = false, precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "MinAmount", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal minAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @CreationTimestamp
    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    public enum DiscountType {
        PERCENT, FIXED
    }

    public enum Status {
        ACTIVE, INACTIVE, EXPIRED
    }
}
