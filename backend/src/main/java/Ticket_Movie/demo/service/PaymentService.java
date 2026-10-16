package Ticket_Movie.demo.service;

import Ticket_Movie.demo.dto.response.PaymentResponse;
import Ticket_Movie.demo.entity.User;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface PaymentService {
    PaymentResponse createPayment(Integer bookingId, String method, HttpServletRequest request, User user);
    PaymentResponse handleVnpayCallback(Map<String, String> queryParams);
}
