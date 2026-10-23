package Ticket_Movie.demo.controller.admin;

import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.dto.response.UserResponse;
import Ticket_Movie.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Users & RBAC", description = "Quản lý người dùng và phân quyền RBAC: ADMIN, STAFF, CUSTOMER")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Xem danh sách toàn bộ người dùng trong hệ thống")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @PutMapping("/{userId}/role")
    @Operation(summary = "Thay đổi phân quyền vai trò (ADMIN, STAFF, CUSTOMER)")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Integer userId,
            @RequestParam String role) {
        UserResponse response = userService.updateUserRole(userId, role);
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật phân quyền vai trò thành: " + role, response));
    }

    @PutMapping("/{userId}/status")
    @Operation(summary = "Khóa hoặc Mở khóa tài khoản (ACTIVE, INACTIVE)")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Integer userId,
            @RequestParam String status) {
        UserResponse response = userService.updateUserStatus(userId, status);
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật trạng thái tài khoản thành: " + status, response));
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Xóa tài khoản người dùng")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Integer userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa người dùng thành công", "DELETED"));
    }
}

