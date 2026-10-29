package Ticket_Movie.demo.config;

import Ticket_Movie.demo.security.JwtAuthEntryPoint;
import Ticket_Movie.demo.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // Swagger & OpenAPI & GraphQL GraphiQL
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api-docs/**",
                                "/v3/api-docs/**",
                                "/graphql/**",
                                "/graphiql/**",
                                "/graphiql"
                        ).permitAll()

                        // Authentication endpoints
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // Public endpoints cho tra cứu phim, suất chiếu, bắp nước, ghế, trợ lý AI
                        .requestMatchers(HttpMethod.GET, "/api/v1/movies/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/showtimes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/foods/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/cinemas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/payments/vnpay-callback").permitAll()
                        .requestMatchers("/api/v1/payments/payos-webhook", "/api/v1/payments/payos/**").permitAll()
                        .requestMatchers("/api/v1/ai/**").permitAll()

                        // Staff Check-in / Soát vé endpoints (Staff & Admin)
                        .requestMatchers("/api/v1/staff/**").hasAnyRole("STAFF", "ADMIN")

                        // Admin Endpoints (chỉ ADMIN)
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                        // Còn lại cần đăng nhập (Customer / Staff / Admin)
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
