package Ticket_Movie.demo.config;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
public class GoogleOAuthConfig {

    /**
     * Verifier kiểm tra Google ID Token: chữ ký (khóa công khai của Google, tự cache),
     * issuer (accounts.google.com), audience (= Client ID của ứng dụng) và thời hạn token.
     */
    @Bean
    public GoogleIdTokenVerifier googleIdTokenVerifier(@Value("${google.client-id:}") String clientId) {
        return new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }
}
