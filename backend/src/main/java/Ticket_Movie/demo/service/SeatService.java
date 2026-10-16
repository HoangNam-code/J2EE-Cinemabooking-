package Ticket_Movie.demo.service;

import Ticket_Movie.demo.dto.response.SeatMapResponse;

public interface SeatService {
    SeatMapResponse getSeatMapForShowtime(Integer showtimeId);
}
