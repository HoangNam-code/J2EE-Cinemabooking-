package Ticket_Movie.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginRequest {

    /** Google ID Token (JWT) do Google Identity Services trả về ở frontend. */
    @NotBlank(message = "Thiếu Google credential")
    private String credential;
}
