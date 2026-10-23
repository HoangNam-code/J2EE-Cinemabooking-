package Ticket_Movie.demo.service.impl;

import Ticket_Movie.demo.service.OtpService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpServiceImpl implements OtpService {

    private static final long OTP_VALID_DURATION_MS = 5 * 60 * 1000; // 5 phút
    private static final int MAX_ATTEMPTS = 5;

    private static class OtpData {
        final String otp;
        final long expiresAt;
        int attempts;

        OtpData(String otp, long expiresAt) {
            this.otp = otp;
            this.expiresAt = expiresAt;
            this.attempts = 0;
        }
    }

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public String generateAndSaveOtp(String email) {
        if (email == null) return null;
        String normalizedEmail = email.trim().toLowerCase();

        // Sinh mã 6 chữ số từ 100000 đến 999999
        int code = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(code);

        long expiresAt = System.currentTimeMillis() + OTP_VALID_DURATION_MS;
        otpStorage.put(normalizedEmail, new OtpData(otp, expiresAt));

        log.info("🔑 [OTP GENERATED] Mã OTP cho email {} là: [{}] (Hết hạn sau 5 phút)", normalizedEmail, otp);
        return otp;
    }

    @Override
    public boolean verifyOtp(String email, String inputOtp) {
        if (email == null || inputOtp == null) return false;
        String normalizedEmail = email.trim().toLowerCase();
        String cleanInput = inputOtp.trim();

        OtpData data = otpStorage.get(normalizedEmail);
        if (data == null) {
            log.warn("Mã OTP không tồn tại hoặc chưa được yêu cầu cho email: {}", normalizedEmail);
            return false;
        }

        // Kiểm tra hết hạn
        if (System.currentTimeMillis() > data.expiresAt) {
            log.warn("Mã OTP cho email {} đã hết hạn", normalizedEmail);
            otpStorage.remove(normalizedEmail);
            return false;
        }

        // Kiểm tra số lần thử sai
        data.attempts++;
        if (data.attempts > MAX_ATTEMPTS) {
            log.warn("Vượt quá số lần thử OTP cho email: {}", normalizedEmail);
            otpStorage.remove(normalizedEmail);
            return false;
        }

        boolean matched = data.otp.equals(cleanInput);
        if (matched) {
            log.info("Xác thực OTP thành công cho email: {}", normalizedEmail);
        } else {
            log.warn("Mã OTP không khớp cho email: {}. Nhập: {}, Đúng: {}", normalizedEmail, cleanInput, data.otp);
        }

        return matched;
    }

    @Override
    public void clearOtp(String email) {
        if (email != null) {
            otpStorage.remove(email.trim().toLowerCase());
        }
    }
}

