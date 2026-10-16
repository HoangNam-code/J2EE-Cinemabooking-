package Ticket_Movie.demo.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    private final int status;

    public AppException(int status, String message) {
        super(message);
        this.status = status;
    }

    public AppException(String message) {
        super(message);
        this.status = 400;
    }
}
