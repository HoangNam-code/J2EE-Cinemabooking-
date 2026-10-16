package Ticket_Movie.demo.service.impl;

import Ticket_Movie.demo.dto.request.ShowtimeCreateRequest;
import Ticket_Movie.demo.dto.response.ShowtimeResponse;
import Ticket_Movie.demo.entity.Cinema;
import Ticket_Movie.demo.entity.Movie;
import Ticket_Movie.demo.entity.Room;
import Ticket_Movie.demo.entity.Showtime;
import Ticket_Movie.demo.exception.AppException;
import Ticket_Movie.demo.exception.ResourceNotFoundException;
import Ticket_Movie.demo.repository.MovieRepository;
import Ticket_Movie.demo.repository.RoomRepository;
import Ticket_Movie.demo.repository.ShowtimeRepository;
import Ticket_Movie.demo.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getShowtimesByMovieAndDate(Integer movieId, LocalDate date) {
        return showtimeRepository.findByMovieMovieIdAndShowDateAndStatus(movieId, date, Showtime.Status.ACTIVE)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getShowtimesByMovie(Integer movieId) {
        return showtimeRepository.findByMovieMovieIdAndStatus(movieId, Showtime.Status.ACTIVE)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getShowtimesByDate(LocalDate date) {
        return showtimeRepository.findByShowDateAndStatus(date, Showtime.Status.ACTIVE)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ShowtimeResponse getShowtimeResponseById(Integer showtimeId) {
        Showtime st = getShowtimeEntityById(showtimeId);
        return mapToResponse(st);
    }

    @Override
    @Transactional(readOnly = true)
    public Showtime getShowtimeEntityById(Integer showtimeId) {
        return showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy suất chiếu ID: " + showtimeId));
    }

    @Override
    @Transactional
    public ShowtimeResponse createShowtime(ShowtimeCreateRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim ID: " + request.getMovieId()));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng chiếu ID: " + request.getRoomId()));

        // Tự động tính endTime nếu chưa truyền
        LocalTime endTime = request.getEndTime();
        if (endTime == null) {
            endTime = request.getStartTime().plusMinutes(movie.getDuration() + 15); // Cộng 15p dọn phòng
        }

        // Kiểm tra trùng lịch trong cùng phòng chiếu
        List<Showtime> existingShowtimes = showtimeRepository.findByRoomRoomIdAndShowDate(request.getRoomId(), request.getShowDate());
        for (Showtime st : existingShowtimes) {
            if (st.getStatus() != Showtime.Status.CANCELLED) {
                boolean overlap = !(endTime.isBefore(st.getStartTime()) || request.getStartTime().isAfter(st.getEndTime()));
                if (overlap) {
                    throw new AppException(400, "Phòng chiếu đã có lịch chiếu trong khung giờ này (" + st.getStartTime() + " - " + st.getEndTime() + ")");
                }
            }
        }

        Showtime showtime = Showtime.builder()
                .movie(movie)
                .room(room)
                .showDate(request.getShowDate())
                .startTime(request.getStartTime())
                .endTime(endTime)
                .format(request.getFormat() != null ? request.getFormat() : room.getRoomType())
                .price(request.getPrice())
                .status(Showtime.Status.ACTIVE)
                .build();

        Showtime saved = showtimeRepository.save(showtime);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public ShowtimeResponse updateShowtime(Integer showtimeId, ShowtimeCreateRequest request) {
        Showtime showtime = getShowtimeEntityById(showtimeId);

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim ID: " + request.getMovieId()));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng chiếu ID: " + request.getRoomId()));

        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setShowDate(request.getShowDate());
        showtime.setStartTime(request.getStartTime());
        showtime.setEndTime(request.getEndTime() != null ? request.getEndTime() : request.getStartTime().plusMinutes(movie.getDuration() + 15));
        showtime.setPrice(request.getPrice());
        if (request.getFormat() != null) {
            showtime.setFormat(request.getFormat());
        }

        Showtime saved = showtimeRepository.save(showtime);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteShowtime(Integer showtimeId) {
        Showtime showtime = getShowtimeEntityById(showtimeId);
        showtime.setStatus(Showtime.Status.CANCELLED);
        showtimeRepository.save(showtime);
    }

    private ShowtimeResponse mapToResponse(Showtime st) {
        Room r = st.getRoom();
        Cinema c = r != null ? r.getCinema() : null;
        Movie m = st.getMovie();

        ShowtimeResponse.CinemaInfo cinemaInfo = null;
        if (c != null) {
            cinemaInfo = ShowtimeResponse.CinemaInfo.builder()
                    .cinemaId(c.getCinemaId())
                    .cinemaName(c.getCinemaName())
                    .address(c.getAddress())
                    .build();
        }

        ShowtimeResponse.RoomInfo roomInfo = null;
        if (r != null) {
            roomInfo = ShowtimeResponse.RoomInfo.builder()
                    .roomId(r.getRoomId())
                    .roomName(r.getRoomName())
                    .roomType(r.getRoomType())
                    .cinema(cinemaInfo)
                    .build();
        }

        return ShowtimeResponse.builder()
                .showtimeId(st.getShowtimeId())
                .movieId(m != null ? m.getMovieId() : null)
                .movieName(m != null ? m.getMovieName() : null)
                .posterUrl(m != null ? m.getPosterUrl() : null)
                .roomId(r != null ? r.getRoomId() : null)
                .roomName(r != null ? r.getRoomName() : null)
                .roomType(r != null ? r.getRoomType() : null)
                .cinemaId(c != null ? c.getCinemaId() : null)
                .cinemaName(c != null ? c.getCinemaName() : null)
                .cinemaAddress(c != null ? c.getAddress() : null)
                .showDate(st.getShowDate())
                .startTime(st.getStartTime())
                .endTime(st.getEndTime())
                .format(st.getFormat())
                .price(st.getPrice())
                .status(st.getStatus() != null ? st.getStatus().name() : null)
                .room(roomInfo)
                .build();
    }
}
