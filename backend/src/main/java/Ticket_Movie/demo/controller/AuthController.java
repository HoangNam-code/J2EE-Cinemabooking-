package Ticket_Movie.demo.controller;

import Ticket_Movie.demo.dto.request.GoogleLoginRequest;
import Ticket_Movie.demo.dto.request.LoginRequest;
import Ticket_Movie.demo.dto.request.RegisterRequest;
import Ticket_Movie.demo.dto.request.SendOtpRequest;
import Ticket_Movie.demo.dto.request.SocialLoginRequest;
import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.dto.response.AuthResponse;
import Ticket_Movie.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Các API xác thực: Đăng nhập, Đăng ký, Gửi OTP, Google OAuth2")
public class AuthController {

    private final UserService userService;

    @Value("${google.client-id:}")
    private String googleClientId;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập tài khoản lấy JWT Token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", response));
    }

    @PostMapping("/send-register-otp")
    @Operation(summary = "Gửi mã xác thực OTP 6 chữ số về email để xác thực đăng ký")
    public ResponseEntity<ApiResponse<String>> sendRegisterOtp(@Valid @RequestBody SendOtpRequest request) {
        userService.sendRegisterOtp(request);
        return ResponseEntity.ok(ApiResponse.success("Mã xác thực OTP đã được gửi tới email " + request.getEmail(), "OTP_SENT"));
    }

    @PostMapping("/register")
    @Operation(summary = "Xác thực OTP và hoàn tất đăng ký tài khoản khách hàng mới")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký và xác thực tài khoản thành công", response));
    }

    @PostMapping("/social-login")
    @Operation(summary = "Đăng nhập nhanh qua Google hoặc Facebook OAuth2")
    public ResponseEntity<ApiResponse<AuthResponse>> socialLogin(@Valid @RequestBody SocialLoginRequest request) {
        AuthResponse response = userService.socialLogin(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập qua " + request.getProvider() + " thành công", response));
    }

    @GetMapping("/google/config")
    @Operation(summary = "Lấy Google Client ID (public) để frontend khởi tạo nút Google Sign-In")
    public ResponseEntity<ApiResponse<Map<String, String>>> googleConfig() {
        return ResponseEntity.ok(ApiResponse.success("OK", Map.of("clientId", googleClientId)));
    }

    @PostMapping("/google")
    @Operation(summary = "Đăng nhập bằng Google (gửi Google ID Token, backend xác minh với Google)")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        AuthResponse response = userService.googleLogin(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập bằng Google thành công", response));
    }
}
