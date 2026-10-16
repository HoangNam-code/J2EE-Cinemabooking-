package Ticket_Movie.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingID")
    private Integer bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "BookingDate", nullable = false)
    private LocalDateTime bookingDate;

    @Column(name = "ExpiresAt")
    private LocalDateTime expiresAt; // Hạn chót thanh toán (giữ ghế 5-10 phút)

    @Column(name = "TotalAmount", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    @Builder.Default
    private Status status = Status.PENDING;

    @CreationTimestamp
    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Ticket> tickets = new ArrayList<>();

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<BookingFood> bookingFoods = new ArrayList<>();

    public enum Status {
        PENDING, PAID, CANCELLED, EXPIRED
    }

    public String getBookingRef() {
        return bookingId != null ? "BK" + String.format("%06d", bookingId) : "BK000000";
    }

    public Showtime getShowtime() {
        if (tickets != null && !tickets.isEmpty() && tickets.get(0).getShowtime() != null) {
            return tickets.get(0).getShowtime();
        }
        return null;
    }
}
