package Ticket_Movie.demo.service;

import Ticket_Movie.demo.dto.request.LoginRequest;
import Ticket_Movie.demo.dto.request.RegisterRequest;
import Ticket_Movie.demo.dto.request.SendOtpRequest;
import Ticket_Movie.demo.dto.request.SocialLoginRequest;
import Ticket_Movie.demo.dto.response.AuthResponse;
import Ticket_Movie.demo.dto.response.UserResponse;
import Ticket_Movie.demo.entity.User;

import java.util.List;

public interface UserService {
    AuthResponse login(LoginRequest request);
    String sendRegisterOtp(SendOtpRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse socialLogin(SocialLoginRequest request);
    User getCurrentUser();
    User getById(Integer userId);

    // Admin RBAC & User Management
    List<UserResponse> getAllUsers();
    UserResponse updateUserRole(Integer userId, String newRole);
    UserResponse updateUserStatus(Integer userId, String newStatus);
    void deleteUser(Integer userId);
}
