package Ticket_Movie.demo.service;

import Ticket_Movie.demo.dto.response.PaymentResponse;
import Ticket_Movie.demo.entity.Booking;
import Ticket_Movie.demo.entity.Payment;

import java.util.Map;

public interface PayOSService {

    /**
     * Tạo yêu cầu thanh toán VietQR động qua PayOS (hết hạn trong 5 phút).
     */
    PaymentResponse createPaymentRequest(Booking booking, Payment payment);

    /**
     * Chủ động kiểm tra trạng thái giao dịch từ PayOS và database (dùng cho polling ở frontend).
     */
    Map<String, Object> checkPaymentStatus(Integer bookingId);

    /**
     * Tiếp nhận và xác thực webhook từ PayOS khi khách chuyển khoản thành công.
     */
    Map<String, Object> handleWebhook(Map<String, Object> payload);
}
