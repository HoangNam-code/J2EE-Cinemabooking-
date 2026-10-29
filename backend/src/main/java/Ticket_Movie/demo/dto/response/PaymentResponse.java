package Ticket_Movie.demo.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Integer bookingId;
    private Integer paymentId;
    private BigDecimal amount;
    private String paymentUrl; // Dành cho VNPAY URL redirect hoặc checkoutUrl
    private String method;
    private String status;

    // Các thông tin PayOS (VietQR)
    private Long orderCode;
    private String qrCode;        // Chuỗi raw QR (EMVCo) để render bằng QR component
    private String qrUrl;         // Link ảnh VietQR trực tiếp từ VietQR / PayOS
    private String accountNumber; // Số tài khoản ngân hàng thụ hưởng
    private String accountName;   // Tên chủ tài khoản
    private String bin;           // Mã BIN ngân hàng (ví dụ: 970422)
    private String description;   // Nội dung chuyển khoản chính xác
    private Long expiredAt;       // Thời điểm hết hạn (Unix timestamp tính bằng giây)
}
