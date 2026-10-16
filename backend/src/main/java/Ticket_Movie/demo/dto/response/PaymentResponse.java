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
    private String paymentUrl; // Dành cho VNPAY URL redirect
    private String method;
    private String status;
}
