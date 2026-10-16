package Ticket_Movie.demo.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialLoginRequest {

    @NotBlank(message = "Nhà cung cấp không được để trống (GOOGLE hoặc FACEBOOK)")
    private String provider; // "GOOGLE" hoặc "FACEBOOK"

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Họ tên không được để trống")
    private String name;

    private String providerId;

    private String avatarUrl;
}
