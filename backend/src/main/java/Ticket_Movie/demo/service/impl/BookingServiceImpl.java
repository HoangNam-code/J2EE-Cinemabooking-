package Ticket_Movie.demo.service.impl;

import Ticket_Movie.demo.dto.request.BookingCreateRequest;
import Ticket_Movie.demo.dto.response.BookingSummaryResponse;
import Ticket_Movie.demo.entity.*;
import Ticket_Movie.demo.exception.AppException;
import Ticket_Movie.demo.exception.ResourceNotFoundException;
import Ticket_Movie.demo.exception.SeatAlreadyBookedException;
import Ticket_Movie.demo.repository.*;
import Ticket_Movie.demo.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final FoodRepository foodRepository;
    private final TicketRepository ticketRepository;
    private final PromotionRepository promotionRepository;
    private final Ticket_Movie.demo.service.EmailService emailService;

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public BookingSummaryResponse createHoldBooking(BookingCreateRequest request, User user) {
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy suất chiếu ID: " + request.getShowtimeId()));

        if (showtime.getStatus() != Showtime.Status.ACTIVE) {
            throw new AppException(400, "Suất chiếu này đã hủy hoặc không còn nhận đặt vé");
        }

        // Lấy danh sách ghế khách chọn
        List<Seat> seats = seatRepository.findBySeatIdIn(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new AppException(400, "Một số ghế không tồn tại");
        }

        // Kiểm tra ghế có thuộc đúng phòng của suất chiếu hay không
        for (Seat seat : seats) {
            if (!seat.getRoom().getRoomId().equals(showtime.getRoom().getRoomId())) {
                throw new AppException(400, "Ghế " + seat.getSeatCode() + " không thuộc phòng chiếu này");
            }
            if (seat.getStatus() != Seat.Status.ACTIVE) {
                throw new AppException(400, "Ghế " + seat.getSeatCode() + " đang được nhân viên khóa bảo trì, không thể đặt");
            }
        }

        // KIỂM TRA XUNG ĐỘT GHẾ (Race Condition / Locking check)
        LocalDateTime now = LocalDateTime.now();
        List<Ticket> existingTickets = ticketRepository.findByShowtimeShowtimeIdAndStatusNot(showtime.getShowtimeId(), Ticket.Status.CANCELLED);
        for (Ticket ticket : existingTickets) {
            if (request.getSeatIds().contains(ticket.getSeat().getSeatId())) {
                Booking b = ticket.getBooking();
                if (b.getStatus() == Booking.Status.PAID) {
                    throw new SeatAlreadyBookedException("Ghế " + ticket.getSeat().getSeatCode() + " đã có người mua");
                } else if (b.getStatus() == Booking.Status.PENDING && b.getExpiresAt() != null && b.getExpiresAt().isAfter(now)) {
                    throw new SeatAlreadyBookedException("Ghế " + ticket.getSeat().getSeatCode() + " hiện đang được giữ bởi người khác");
                }
            }
        }

        // Giữ ghế trong 10 phút
        LocalDateTime expiresAt = now.plusMinutes(10);

        Booking booking = Booking.builder()
                .user(user)
                .bookingDate(now)
                .expiresAt(expiresAt)
                .status(Booking.Status.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .build();
        booking = bookingRepository.save(booking);

        // Tạo Tickets và tính tiền vé
        BigDecimal ticketSubtotal = BigDecimal.ZERO;
        List<Ticket> tickets = new ArrayList<>();
        for (Seat seat : seats) {
            BigDecimal seatPrice = showtime.getPrice();
            if (seat.getSeatType() == Seat.SeatType.VIP) {
                seatPrice = seatPrice.add(new BigDecimal("15000"));
            } else if (seat.getSeatType() == Seat.SeatType.COUPLE) {
                seatPrice = seatPrice.add(new BigDecimal("30000"));
            }

            Ticket ticket = Ticket.builder()
                    .booking(booking)
                    .showtime(showtime)
                    .seat(seat)
                    .price(seatPrice)
                    .status(Ticket.Status.VALID)
                    .qrCode("TICKET-" + booking.getBookingId() + "-" + seat.getSeatCode() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .build();
            tickets.add(ticket);
            ticketSubtotal = ticketSubtotal.add(seatPrice);
        }
        ticketRepository.saveAll(tickets);
        booking.setTickets(tickets);

        // Xử lý bắp nước (nếu có)
        BigDecimal foodSubtotal = BigDecimal.ZERO;
        List<BookingFood> bookingFoods = new ArrayList<>();
        if (request.getFoods() != null && !request.getFoods().isEmpty()) {
            for (BookingCreateRequest.FoodOrderRequest foodReq : request.getFoods()) {
                if (foodReq.getQuantity() != null && foodReq.getQuantity() > 0) {
                    Food food = foodRepository.findById(foodReq.getFoodId())
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bắp/nước ID: " + foodReq.getFoodId()));
                    if (food.getStatus() != Food.Status.ACTIVE) {
                        throw new AppException(400, "Món " + food.getFoodName() + " hiện đã hết hàng tại quầy rạp!");
                    }

                    BigDecimal itemTotal = food.getPrice().multiply(new BigDecimal(foodReq.getQuantity()));
                    foodSubtotal = foodSubtotal.add(itemTotal);

                    BookingFood bookingFood = BookingFood.builder()
                            .id(new BookingFood.BookingFoodId(booking.getBookingId(), food.getFoodId()))
                            .booking(booking)
                            .food(food)
                            .quantity(foodReq.getQuantity())
                            .price(food.getPrice())
                            .build();
                    bookingFoods.add(bookingFood);
                }
            }
        }
        booking.setBookingFoods(bookingFoods);

        // Tính giảm giá nếu có mã khuyến mãi
        BigDecimal rawTotal = ticketSubtotal.add(foodSubtotal);
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getPromotionCode() != null && !request.getPromotionCode().trim().isEmpty()) {
            Optional<Promotion> promoOpt = promotionRepository.findByPromotionCodeAndStatus(request.getPromotionCode().trim(), Promotion.Status.ACTIVE);
            if (promoOpt.isPresent()) {
                Promotion promo = promoOpt.get();
                LocalDate today = LocalDate.now();
                if (!today.isBefore(promo.getStartDate()) && !today.isAfter(promo.getEndDate()) && rawTotal.compareTo(promo.getMinAmount()) >= 0) {
                    if (promo.getDiscountType() == Promotion.DiscountType.PERCENT) {
                        discountAmount = rawTotal.multiply(promo.getDiscountValue()).divide(new BigDecimal("100"));
                    } else {
                        discountAmount = promo.getDiscountValue();
                    }
                    if (discountAmount.compareTo(rawTotal) > 0) {
                        discountAmount = rawTotal;
                    }
                }
            }
        }

        BigDecimal finalTotal = rawTotal.subtract(discountAmount);
        if (finalTotal.compareTo(BigDecimal.ZERO) < 0) {
            finalTotal = BigDecimal.ZERO;
        }

        booking.setTotalAmount(finalTotal);
        bookingRepository.save(booking);

        return mapToSummary(booking, showtime, ticketSubtotal, foodSubtotal, request.getPromotionCode(), discountAmount);
    }

    @Override
    public BookingSummaryResponse getBookingSummary(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking ID: " + bookingId));

        Showtime showtime = booking.getTickets().isEmpty() ? null : booking.getTickets().get(0).getShowtime();

        BigDecimal ticketSubtotal = booking.getTickets().stream()
                .map(Ticket::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal foodSubtotal = booking.getBookingFoods().stream()
                .map(bf -> bf.getPrice().multiply(new BigDecimal(bf.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = ticketSubtotal.add(foodSubtotal).subtract(booking.getTotalAmount());
        if (discount.compareTo(BigDecimal.ZERO) < 0) discount = BigDecimal.ZERO;

        return mapToSummary(booking, showtime, ticketSubtotal, foodSubtotal, null, discount);
    }

    @Override
    public List<BookingSummaryResponse> getUserBookings(Integer userId) {
        List<Booking> list = bookingRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
        return list.stream().map(b -> getBookingSummary(b.getBookingId())).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelBooking(Integer bookingId, User user) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking ID: " + bookingId));

        if (user != null && !booking.getUser().getUserId().equals(user.getUserId()) && user.getRole() != User.Role.ADMIN) {
            throw new AppException(403, "Bạn không có quyền thao tác trên đơn hàng này");
        }

        booking.setStatus(Booking.Status.CANCELLED);
        for (Ticket t : booking.getTickets()) {
            t.setStatus(Ticket.Status.CANCELLED);
        }
        bookingRepository.save(booking);

        // Gửi email thông báo hủy vé
        try {
            emailService.sendBookingCancellationEmail(booking);
        } catch (Exception ignored) {}
    }

    @Override
    @Transactional
    public void confirmBookingPayment(Integer bookingId, String transactionId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking ID: " + bookingId));

        booking.setStatus(Booking.Status.PAID);
        for (Ticket t : booking.getTickets()) {
            t.setStatus(Ticket.Status.VALID);
        }
        bookingRepository.save(booking);

        // Gửi email vé điện tử HTML kèm mã QR check-in
        try {
            emailService.sendBookingConfirmationEmail(booking);
        } catch (Exception ignored) {}
    }

    private BookingSummaryResponse mapToSummary(Booking booking, Showtime showtime, BigDecimal ticketSubtotal, BigDecimal foodSubtotal, String promoCode, BigDecimal discountAmount) {
        long remainingSeconds = 0;
        if (booking.getStatus() == Booking.Status.PENDING && booking.getExpiresAt() != null) {
            remainingSeconds = Math.max(0, Duration.between(LocalDateTime.now(), booking.getExpiresAt()).getSeconds());
        }

        List<BookingSummaryResponse.TicketItem> ticketItems = booking.getTickets().stream().map(t ->
                BookingSummaryResponse.TicketItem.builder()
                        .ticketId(t.getTicketId())
                        .seatId(t.getSeat().getSeatId())
                        .seatCode(t.getSeat().getSeatCode())
                        .seatType(t.getSeat().getSeatType().name())
                        .price(t.getPrice())
                        .qrCode(t.getQrCode())
                        .build()
        ).collect(Collectors.toList());

        List<BookingSummaryResponse.FoodItem> foodItems = booking.getBookingFoods().stream().map(bf ->
                BookingSummaryResponse.FoodItem.builder()
                        .foodId(bf.getFood().getFoodId())
                        .foodName(bf.getFood().getFoodName())
                        .quantity(bf.getQuantity())
                        .price(bf.getPrice())
                        .subtotal(bf.getPrice().multiply(new BigDecimal(bf.getQuantity())))
                        .build()
        ).collect(Collectors.toList());

        return BookingSummaryResponse.builder()
                .bookingId(booking.getBookingId())
                .status(booking.getStatus().name())
                .bookingDate(booking.getBookingDate())
                .expiresAt(booking.getExpiresAt())
                .remainingSeconds(remainingSeconds)
                .movieId(showtime != null ? showtime.getMovie().getMovieId() : null)
                .movieName(showtime != null ? showtime.getMovie().getMovieName() : null)
                .posterUrl(showtime != null ? showtime.getMovie().getPosterUrl() : null)
                .cinemaName(showtime != null ? showtime.getRoom().getCinema().getCinemaName() : null)
                .roomName(showtime != null ? showtime.getRoom().getRoomName() : null)
                .showDate(showtime != null ? showtime.getShowDate().toString() : null)
                .startTime(showtime != null ? showtime.getStartTime().toString() : null)
                .tickets(ticketItems)
                .ticketSubtotal(ticketSubtotal)
                .foods(foodItems)
                .foodSubtotal(foodSubtotal)
                .promotionCode(promoCode)
                .discountAmount(discountAmount)
                .totalAmount(booking.getTotalAmount())
                .build();
    }
}
