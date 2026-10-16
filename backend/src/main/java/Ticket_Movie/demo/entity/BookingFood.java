package Ticket_Movie.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "bookingfoods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingFood {

    @EmbeddedId
    private BookingFoodId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookingId")
    @JoinColumn(name = "BookingID")
    private Booking booking;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("foodId")
    @JoinColumn(name = "FoodID")
    private Food food;

    @Column(name = "Quantity", nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "Price", nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class BookingFoodId implements Serializable {
        private Integer bookingId;
        private Integer foodId;
    }
}
