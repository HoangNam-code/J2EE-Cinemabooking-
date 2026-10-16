package Ticket_Movie.demo.service;

import Ticket_Movie.demo.entity.Booking;

public interface EmailService {
    /**
     * Gửi email xác nhận đặt vé thành công kèm mã vé điện tử và QR Code
     */
    void sendBookingConfirmationEmail(Booking booking);

    /**
     * Gửi email thông báo hủy vé
     */
    void sendBookingCancellationEmail(Booking booking);
}
