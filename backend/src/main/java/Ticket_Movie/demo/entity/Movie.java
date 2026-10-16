package Ticket_Movie.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MovieID")
    private Integer movieId;

    @Column(name = "MovieName", nullable = false, length = 200)
    private String movieName;

    @Column(name = "Duration", nullable = false)
    private Integer duration; // phút

    @Column(name = "Director", length = 200)
    private String director;

    @Column(name = "Actors", length = 1000)
    private String actors;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "ReleaseDate")
    private LocalDate releaseDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "PosterURL", length = 500)
    private String posterUrl;

    @Column(name = "TrailerURL", length = 500)
    private String trailerUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    @Builder.Default
    private Status status = Status.COMING_SOON;

    @CreationTimestamp
    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "moviecategories",
            joinColumns = @JoinColumn(name = "MovieID"),
            inverseJoinColumns = @JoinColumn(name = "CategoryID")
    )
    @Builder.Default
    private Set<Category> categories = new HashSet<>();

    public enum Status {
        COMING_SOON, NOW_SHOWING, ENDED
    }
}
