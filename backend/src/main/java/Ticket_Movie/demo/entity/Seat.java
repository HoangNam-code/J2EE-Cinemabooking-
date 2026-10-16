package Ticket_Movie.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "seats", uniqueConstraints = {
        @UniqueConstraint(name = "UQ_Seats_Room_Seat", columnNames = {"RoomID", "SeatCode"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SeatID")
    private Integer seatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RoomID", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Room room;

    @Column(name = "SeatCode", nullable = false, length = 10)
    private String seatCode; // A01, B02...

    @Column(name = "RowName", nullable = false, length = 10)
    private String rowName; // A, B, C...

    @Column(name = "SeatNumber", nullable = false)
    private Integer seatNumber; // 1, 2, 3...

    @Enumerated(EnumType.STRING)
    @Column(name = "SeatType", nullable = false)
    @Builder.Default
    private SeatType seatType = SeatType.NORMAL;

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

    public enum SeatType {
        NORMAL, VIP, COUPLE
    }

    public enum Status {
        ACTIVE, INACTIVE, MAINTENANCE
    }
}
