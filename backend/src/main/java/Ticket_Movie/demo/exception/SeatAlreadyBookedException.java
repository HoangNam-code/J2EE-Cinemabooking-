package Ticket_Movie.demo.exception;

public class SeatAlreadyBookedException extends AppException {
    public SeatAlreadyBookedException(String message) {
        super(409, message);
    }
}
