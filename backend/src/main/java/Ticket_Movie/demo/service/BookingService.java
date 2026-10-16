package Ticket_Movie.demo.service;

import Ticket_Movie.demo.dto.request.BookingCreateRequest;
import Ticket_Movie.demo.dto.response.BookingSummaryResponse;
import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.User;

import java.util.List;

public interface BookingService {
    BookingSummaryResponse createHoldBooking(BookingCreateRequest request, User user);
    BookingSummaryResponse getBookingSummary(Integer bookingId);
    List<BookingSummaryResponse> getUserBookings(Integer userId);
    void cancelBooking(Integer bookingId, User user);
    void confirmBookingPayment(Integer bookingId, String transactionId);
}
