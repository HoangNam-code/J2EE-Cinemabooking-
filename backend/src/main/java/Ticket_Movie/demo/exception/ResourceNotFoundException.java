package Ticket_Movie.demo.exception;

public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String message) {
        super(404, message);
    }
}
