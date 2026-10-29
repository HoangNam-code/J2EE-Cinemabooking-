package Ticket_Movie.demo.controller;

import Ticket_Movie.demo.dto.response.ApiResponse;
import Ticket_Movie.demo.dto.response.PaymentResponse;
import Ticket_Movie.demo.entity.User;
import Ticket_Movie.demo.service.PaymentService;
import Ticket_Movie.demo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Các API thanh toán đơn hàng (VNPAY Sandbox, Banking, Tiền mặt)")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;
    private final Ticket_Movie.demo.service.PayOSService payOSService;

    @PostMapping("/create")
    @Operation(summary = "Tạo yêu cầu thanh toán (Hỗ trợ phương thức: VNPAY, BANKING, CASH, MOMO)")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
            @RequestParam Integer bookingId,
            @RequestParam(defaultValue = "VNPAY") String method,
            HttpServletRequest request) {
        User currentUser = userService.getCurrentUser();
        PaymentResponse response = paymentService.createPayment(bookingId, method, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Khởi tạo thanh toán thành công", response));
    }

    @GetMapping("/vnpay-callback")
    @Operation(summary = "Tiếp nhận webhook callback trả về từ cổng thanh toán VNPAY")
    public ResponseEntity<ApiResponse<PaymentResponse>> vnpayCallback(@RequestParam Map<String, String> params) {
        PaymentResponse response = paymentService.handleVnpayCallback(params);
        return ResponseEntity.ok(ApiResponse.success("Xử lý kết quả VNPAY thành công", response));
    }

    @GetMapping("/payos/status/{bookingId}")
    @Operation(summary = "Kiểm tra trạng thái thanh toán PayOS theo bookingId (dùng cho frontend đếm ngược polling)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkPayOSStatus(@PathVariable Integer bookingId) {
        Map<String, Object> result = payOSService.checkPaymentStatus(bookingId);
        return ResponseEntity.ok(ApiResponse.success("OK", result));
    }

    @PostMapping("/payos-webhook")
    @Operation(summary = "Tiếp nhận Webhook tức thời từ cổng PayOS khi khách chuyển khoản thành công")
    public ResponseEntity<Map<String, Object>> payosWebhook(@RequestBody Map<String, Object> payload) {
        Map<String, Object> result = payOSService.handleWebhook(payload);
        return ResponseEntity.ok(result);
    }
}
