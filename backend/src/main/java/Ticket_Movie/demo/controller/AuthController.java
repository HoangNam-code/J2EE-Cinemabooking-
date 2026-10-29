package Ticket_Movie.demo.controller;

import Ticket_Movie.demo.dto.request.GoogleLoginRequest;
import Ticket_Movie.demo.dto.request.LoginRequest;
import Ticket_Movie.demo.dto.request.RegisterRequest;
import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.dto.response.AuthResponse;
import Ticket_Movie.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Các API xác thực: Đăng nhập, Đăng ký")
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

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản khách hàng mới")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký tài khoản thành công", response));
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
