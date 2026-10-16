package Ticket_Movie.demo.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private Integer userId;
    private String username;
    private String fullName;
    private String email;
    private String role;
}
