package Ticket_Movie.demo.service;

public interface OtpService {
    /**
     * Sinh mã OTP 6 chữ số ngẫu nhiên, lưu vào bộ nhớ cache kèm thời gian hết hạn (5 phút)
     */
    String generateAndSaveOtp(String email);

    /**
     * Kiểm tra tính hợp lệ của mã OTP
     */
    boolean verifyOtp(String email, String inputOtp);

    /**
     * Xóa mã OTP sau khi sử dụng thành công
     */
    void clearOtp(String email);
}

