package Ticket_Movie.demo.controller;
import Ticket_Movie.demo.dto.response.MovieDetailResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import Ticket_Movie.demo.repository.CinemaRepository;
import org.springframework.http.ResponseEntity;
import Ticket_Movie.demo.entity.Cinema;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/movies")
@CrossOrigin(origins = "*") // "*" cho phép các nguồn gọi API này
public class CinemaController {

    @Autowired // Bảo Spring IoC Container tìm một bean phù hợp vào biến,constructor hoặc get/set lớp gắn anotation
    private CinemaRepository cinemaRepository;

    @GetMapping
    public ResponseEntity<List<Cinema>> getAllCinema() {
        List<Cinema> cinema =  cinemaRepository.findAll();
        return ResponseEntity.ok(cinema);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cinema> getCinemaById(@PathVariable int id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("không tìm thấy suất chiếu"));
        return ResponseEntity.ok(cinema);
    }


}