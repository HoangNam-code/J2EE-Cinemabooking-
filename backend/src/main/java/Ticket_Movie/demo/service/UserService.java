package Ticket_Movie.demo.service;

import Ticket_Movie.demo.dto.request.GoogleLoginRequest;
import Ticket_Movie.demo.dto.request.LoginRequest;
import Ticket_Movie.demo.dto.request.RegisterRequest;
import Ticket_Movie.demo.dto.response.AuthResponse;
import Ticket_Movie.demo.entity.User;

public interface UserService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse googleLogin(GoogleLoginRequest request);
    User getCurrentUser();
    User getById(Integer userId);
}
