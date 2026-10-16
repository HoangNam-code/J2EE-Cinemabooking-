-- ========================================================
-- CINEPRIME - CINEMA BOOKING SYSTEM SAMPLE DATA
-- Hệ quản trị CSDL: MySQL / MariaDB (XAMPP tương thích)
-- Tập tin: cinemabooking_sample_data.sql
-- Mật khẩu mặc định cho tất cả tài khoản test: 123456
-- ========================================================

USE `cinemabooking`;

-- --------------------------------------------------------
-- 1. Dữ liệu mẫu users (Password hash BCrypt cho '123456')
-- --------------------------------------------------------
INSERT INTO `users` (`UserID`, `Username`, `PasswordHash`, `FullName`, `Email`, `Phone`, `Role`, `Status`) VALUES
(1, 'admin', '$2a$12$Nq571gNdrKlyUfO22G5oXeN3W.kEdfz0s4a9i2cT9cskp2W.fP/4W', 'Quản trị viên', 'admin@cineprime.com', '0900000001', 'ADMIN', 'ACTIVE'),
(2, 'staff01', '$2a$12$Nq571gNdrKlyUfO22G5oXeN3W.kEdfz0s4a9i2cT9cskp2W.fP/4W', 'Nhân viên CinePrime', 'staff@cineprime.com', '0900000002', 'STAFF', 'ACTIVE'),
(3, 'customer01', '$2a$12$Nq571gNdrKlyUfO22G5oXeN3W.kEdfz0s4a9i2cT9cskp2W.fP/4W', 'Nguyễn Văn An', 'an@gmail.com', '0900000003', 'CUSTOMER', 'ACTIVE'),
(4, 'customer02', '$2a$12$Nq571gNdrKlyUfO22G5oXeN3W.kEdfz0s4a9i2cT9cskp2W.fP/4W', 'Trần Thị Bình', 'binh@gmail.com', '0900000004', 'CUSTOMER', 'ACTIVE')
ON DUPLICATE KEY UPDATE `FullName`=VALUES(`FullName`);

-- --------------------------------------------------------
-- 2. Dữ liệu mẫu categories
-- --------------------------------------------------------
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES
(1, 'Hành động', 'Phim hành động kịch tính, mãn nhãn'),
(2, 'Khoa học viễn tưởng', 'Phim viễn tưởng, không gian và tương lai'),
(3, 'Tình cảm', 'Phim tình cảm lãng mạn nhẹ nhàng'),
(4, 'Kinh dị', 'Phim kinh dị giật gân, hồi hộp'),
(5, 'Hoạt hình', 'Phim hoạt hình gia đình và thiếu nhi'),
(6, 'Hài', 'Phim hài hước dí dỏm thư giãn')
ON DUPLICATE KEY UPDATE `CategoryName`=VALUES(`CategoryName`);

-- --------------------------------------------------------
-- 3. Dữ liệu mẫu movies
-- --------------------------------------------------------
INSERT INTO `movies` (`MovieID`, `MovieName`, `Duration`, `Director`, `Actors`, `Description`, `ReleaseDate`, `EndDate`, `PosterURL`, `TrailerURL`, `Status`) VALUES
(1, 'Biên Niên Sử Orion: Tiếng Vọng Vĩnh Hằng', 168, 'Christopher Nolan', 'Julian Mercer, Elena Rostova, Kofi Asante', 'Một nhóm phi hành gia tiến vào vùng không gian Orion để tìm kiếm dấu vết cuối cùng của nền văn minh nhân loại trước bờ vực tuyệt diệt.', '2026-10-01', '2026-11-30', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'NOW_SHOWING'),
(2, 'Thành Phố Bóng Đêm', 125, 'James Carter', 'Michael Stone, Anna Lee, Victor Vance', 'Một thám tử kỳ cựu phải chạy đua với thời gian để ngăn chặn âm mưu đen tối của tổ chức tội phạm nguy hiểm bậc nhất ngầm thành phố.', '2026-10-15', '2026-12-15', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600', 'https://www.youtube.com/watch?v=1g3_CFmnU7k', 'COMING_SOON'),
(3, 'Cuộc Phiêu Lưu Của Những Vì Sao', 110, 'Robert Wilson', 'Emma Brown, Daniel Kim, Lily Chen', 'Chuyến hành trình màu sắc xuyên qua các dải ngân hà kỳ thú của nhóm bạn trẻ với ước mơ tìm kiếm nguồn năng lượng ánh sáng mới.', '2026-10-05', '2026-11-25', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600', 'https://www.youtube.com/watch?v=d9MyW72ELq0', 'NOW_SHOWING')
ON DUPLICATE KEY UPDATE `MovieName`=VALUES(`MovieName`);

-- --------------------------------------------------------
-- 4. Dữ liệu mẫu moviecategories
-- --------------------------------------------------------
INSERT IGNORE INTO `moviecategories` (`MovieID`, `CategoryID`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 4),
(3, 5),
(3, 6);

-- --------------------------------------------------------
-- 5. Dữ liệu mẫu cinemas
-- --------------------------------------------------------
INSERT INTO `cinemas` (`CinemaID`, `CinemaName`, `Address`, `Phone`, `Status`) VALUES
(1, 'CinePrime Landmark Quận 1', '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM', '02830000001', 'ACTIVE'),
(2, 'CinePrime Mega Mall Thủ Đức', '456 Võ Văn Ngân, Phường Bình Thọ, TP. Thủ Đức, TP.HCM', '02830000002', 'ACTIVE')
ON DUPLICATE KEY UPDATE `CinemaName`=VALUES(`CinemaName`);

-- --------------------------------------------------------
-- 6. Dữ liệu mẫu rooms
-- --------------------------------------------------------
INSERT INTO `rooms` (`RoomID`, `CinemaID`, `RoomName`, `RoomType`, `Capacity`, `Status`) VALUES
(1, 1, 'Phòng 01 VIP Digital', '2D', 20, 'ACTIVE'),
(2, 1, 'Phòng 02 Laser IMAX', 'IMAX', 20, 'ACTIVE'),
(3, 1, 'Phòng 03 Dolby Atmos', 'DOLBY', 20, 'ACTIVE'),
(4, 2, 'Phòng 01 Mega Screen', '2D', 20, 'ACTIVE'),
(5, 2, 'Phòng 02 Real 3D', '3D', 20, 'ACTIVE')
ON DUPLICATE KEY UPDATE `RoomName`=VALUES(`RoomName`);

-- --------------------------------------------------------
-- 7. Dữ liệu mẫu seats (Tất cả 5 phòng chiếu đều có ghế đầy đủ)
-- --------------------------------------------------------
INSERT INTO `seats` (`RoomID`, `SeatCode`, `RowName`, `SeatNumber`, `SeatType`, `Status`) VALUES
-- Phòng 1: 20 ghế
(1, 'A01', 'A', 1, 'NORMAL', 'ACTIVE'), (1, 'A02', 'A', 2, 'NORMAL', 'ACTIVE'), (1, 'A03', 'A', 3, 'NORMAL', 'ACTIVE'), (1, 'A04', 'A', 4, 'NORMAL', 'ACTIVE'), (1, 'A05', 'A', 5, 'NORMAL', 'ACTIVE'),
(1, 'B01', 'B', 1, 'NORMAL', 'ACTIVE'), (1, 'B02', 'B', 2, 'NORMAL', 'ACTIVE'), (1, 'B03', 'B', 3, 'NORMAL', 'ACTIVE'), (1, 'B04', 'B', 4, 'NORMAL', 'ACTIVE'), (1, 'B05', 'B', 5, 'NORMAL', 'ACTIVE'),
(1, 'C01', 'C', 1, 'VIP', 'ACTIVE'), (1, 'C02', 'C', 2, 'VIP', 'ACTIVE'), (1, 'C03', 'C', 3, 'VIP', 'ACTIVE'), (1, 'C04', 'C', 4, 'VIP', 'ACTIVE'), (1, 'C05', 'C', 5, 'VIP', 'ACTIVE'),
(1, 'D01', 'D', 1, 'VIP', 'ACTIVE'), (1, 'D02', 'D', 2, 'VIP', 'ACTIVE'), (1, 'D03', 'D', 3, 'VIP', 'ACTIVE'), (1, 'D04', 'D', 4, 'COUPLE', 'ACTIVE'), (1, 'D05', 'D', 5, 'COUPLE', 'ACTIVE'),
-- Phòng 2 (Laser IMAX): 28 ghế
(2, 'A01', 'A', 1, 'NORMAL', 'ACTIVE'), (2, 'A02', 'A', 2, 'NORMAL', 'ACTIVE'), (2, 'A03', 'A', 3, 'NORMAL', 'ACTIVE'), (2, 'A04', 'A', 4, 'NORMAL', 'ACTIVE'), (2, 'A05', 'A', 5, 'NORMAL', 'ACTIVE'), (2, 'A06', 'A', 6, 'NORMAL', 'ACTIVE'),
(2, 'B01', 'B', 1, 'NORMAL', 'ACTIVE'), (2, 'B02', 'B', 2, 'NORMAL', 'ACTIVE'), (2, 'B03', 'B', 3, 'NORMAL', 'ACTIVE'), (2, 'B04', 'B', 4, 'NORMAL', 'ACTIVE'), (2, 'B05', 'B', 5, 'NORMAL', 'ACTIVE'), (2, 'B06', 'B', 6, 'NORMAL', 'ACTIVE'),
(2, 'C01', 'C', 1, 'VIP', 'ACTIVE'), (2, 'C02', 'C', 2, 'VIP', 'ACTIVE'), (2, 'C03', 'C', 3, 'VIP', 'ACTIVE'), (2, 'C04', 'C', 4, 'VIP', 'ACTIVE'), (2, 'C05', 'C', 5, 'VIP', 'ACTIVE'), (2, 'C06', 'C', 6, 'VIP', 'ACTIVE'),
(2, 'D01', 'D', 1, 'VIP', 'ACTIVE'), (2, 'D02', 'D', 2, 'VIP', 'ACTIVE'), (2, 'D03', 'D', 3, 'VIP', 'ACTIVE'), (2, 'D04', 'D', 4, 'VIP', 'ACTIVE'), (2, 'D05', 'D', 5, 'VIP', 'ACTIVE'), (2, 'D06', 'D', 6, 'VIP', 'ACTIVE'),
(2, 'E01', 'E', 1, 'COUPLE', 'ACTIVE'), (2, 'E02', 'E', 2, 'COUPLE', 'ACTIVE'), (2, 'E03', 'E', 3, 'COUPLE', 'ACTIVE'), (2, 'E04', 'E', 4, 'COUPLE', 'ACTIVE'),
-- Phòng 3 (Dolby Atmos): 28 ghế
(3, 'A01', 'A', 1, 'NORMAL', 'ACTIVE'), (3, 'A02', 'A', 2, 'NORMAL', 'ACTIVE'), (3, 'A03', 'A', 3, 'NORMAL', 'ACTIVE'), (3, 'A04', 'A', 4, 'NORMAL', 'ACTIVE'), (3, 'A05', 'A', 5, 'NORMAL', 'ACTIVE'), (3, 'A06', 'A', 6, 'NORMAL', 'ACTIVE'),
(3, 'B01', 'B', 1, 'NORMAL', 'ACTIVE'), (3, 'B02', 'B', 2, 'NORMAL', 'ACTIVE'), (3, 'B03', 'B', 3, 'NORMAL', 'ACTIVE'), (3, 'B04', 'B', 4, 'NORMAL', 'ACTIVE'), (3, 'B05', 'B', 5, 'NORMAL', 'ACTIVE'), (3, 'B06', 'B', 6, 'NORMAL', 'ACTIVE'),
(3, 'C01', 'C', 1, 'VIP', 'ACTIVE'), (3, 'C02', 'C', 2, 'VIP', 'ACTIVE'), (3, 'C03', 'C', 3, 'VIP', 'ACTIVE'), (3, 'C04', 'C', 4, 'VIP', 'ACTIVE'), (3, 'C05', 'C', 5, 'VIP', 'ACTIVE'), (3, 'C06', 'C', 6, 'VIP', 'ACTIVE'),
(3, 'D01', 'D', 1, 'VIP', 'ACTIVE'), (3, 'D02', 'D', 2, 'VIP', 'ACTIVE'), (3, 'D03', 'D', 3, 'VIP', 'ACTIVE'), (3, 'D04', 'D', 4, 'VIP', 'ACTIVE'), (3, 'D05', 'D', 5, 'VIP', 'ACTIVE'), (3, 'D06', 'D', 6, 'VIP', 'ACTIVE'),
(3, 'E01', 'E', 1, 'COUPLE', 'ACTIVE'), (3, 'E02', 'E', 2, 'COUPLE', 'ACTIVE'), (3, 'E03', 'E', 3, 'COUPLE', 'ACTIVE'), (3, 'E04', 'E', 4, 'COUPLE', 'ACTIVE'),
-- Phòng 4 (Mega Screen): 28 ghế
(4, 'A01', 'A', 1, 'NORMAL', 'ACTIVE'), (4, 'A02', 'A', 2, 'NORMAL', 'ACTIVE'), (4, 'A03', 'A', 3, 'NORMAL', 'ACTIVE'), (4, 'A04', 'A', 4, 'NORMAL', 'ACTIVE'), (4, 'A05', 'A', 5, 'NORMAL', 'ACTIVE'), (4, 'A06', 'A', 6, 'NORMAL', 'ACTIVE'),
(4, 'B01', 'B', 1, 'NORMAL', 'ACTIVE'), (4, 'B02', 'B', 2, 'NORMAL', 'ACTIVE'), (4, 'B03', 'B', 3, 'NORMAL', 'ACTIVE'), (4, 'B04', 'B', 4, 'NORMAL', 'ACTIVE'), (4, 'B05', 'B', 5, 'NORMAL', 'ACTIVE'), (4, 'B06', 'B', 6, 'NORMAL', 'ACTIVE'),
(4, 'C01', 'C', 1, 'VIP', 'ACTIVE'), (4, 'C02', 'C', 2, 'VIP', 'ACTIVE'), (4, 'C03', 'C', 3, 'VIP', 'ACTIVE'), (4, 'C04', 'C', 4, 'VIP', 'ACTIVE'), (4, 'C05', 'C', 5, 'VIP', 'ACTIVE'), (4, 'C06', 'C', 6, 'VIP', 'ACTIVE'),
(4, 'D01', 'D', 1, 'VIP', 'ACTIVE'), (4, 'D02', 'D', 2, 'VIP', 'ACTIVE'), (4, 'D03', 'D', 3, 'VIP', 'ACTIVE'), (4, 'D04', 'D', 4, 'VIP', 'ACTIVE'), (4, 'D05', 'D', 5, 'VIP', 'ACTIVE'), (4, 'D06', 'D', 6, 'VIP', 'ACTIVE'),
(4, 'E01', 'E', 1, 'COUPLE', 'ACTIVE'), (4, 'E02', 'E', 2, 'COUPLE', 'ACTIVE'), (4, 'E03', 'E', 3, 'COUPLE', 'ACTIVE'), (4, 'E04', 'E', 4, 'COUPLE', 'ACTIVE'),
-- Phòng 5 (Real 3D): 28 ghế
(5, 'A01', 'A', 1, 'NORMAL', 'ACTIVE'), (5, 'A02', 'A', 2, 'NORMAL', 'ACTIVE'), (5, 'A03', 'A', 3, 'NORMAL', 'ACTIVE'), (5, 'A04', 'A', 4, 'NORMAL', 'ACTIVE'), (5, 'A05', 'A', 5, 'NORMAL', 'ACTIVE'), (5, 'A06', 'A', 6, 'NORMAL', 'ACTIVE'),
(5, 'B01', 'B', 1, 'NORMAL', 'ACTIVE'), (5, 'B02', 'B', 2, 'NORMAL', 'ACTIVE'), (5, 'B03', 'B', 3, 'NORMAL', 'ACTIVE'), (5, 'B04', 'B', 4, 'NORMAL', 'ACTIVE'), (5, 'B05', 'B', 5, 'NORMAL', 'ACTIVE'), (5, 'B06', 'B', 6, 'NORMAL', 'ACTIVE'),
(5, 'C01', 'C', 1, 'VIP', 'ACTIVE'), (5, 'C02', 'C', 2, 'VIP', 'ACTIVE'), (5, 'C03', 'C', 3, 'VIP', 'ACTIVE'), (5, 'C04', 'C', 4, 'VIP', 'ACTIVE'), (5, 'C05', 'C', 5, 'VIP', 'ACTIVE'), (5, 'C06', 'C', 6, 'VIP', 'ACTIVE'),
(5, 'D01', 'D', 1, 'VIP', 'ACTIVE'), (5, 'D02', 'D', 2, 'VIP', 'ACTIVE'), (5, 'D03', 'D', 3, 'VIP', 'ACTIVE'), (5, 'D04', 'D', 4, 'VIP', 'ACTIVE'), (5, 'D05', 'D', 5, 'VIP', 'ACTIVE'), (5, 'D06', 'D', 6, 'VIP', 'ACTIVE'),
(5, 'E01', 'E', 1, 'COUPLE', 'ACTIVE'), (5, 'E02', 'E', 2, 'COUPLE', 'ACTIVE'), (5, 'E03', 'E', 3, 'COUPLE', 'ACTIVE'), (5, 'E04', 'E', 4, 'COUPLE', 'ACTIVE')
ON DUPLICATE KEY UPDATE `SeatCode`=VALUES(`SeatCode`);

-- --------------------------------------------------------
-- 8. Dữ liệu mẫu showtimes (Suất chiếu hôm nay & các ngày tới)
-- --------------------------------------------------------
INSERT INTO `showtimes` (`ShowtimeID`, `MovieID`, `RoomID`, `ShowDate`, `StartTime`, `EndTime`, `Format`, `Price`, `Status`) VALUES
(1, 1, 1, CURRENT_DATE(), '09:30:00', '12:18:00', '2D', 95000.00, 'ACTIVE'),
(2, 1, 2, CURRENT_DATE(), '14:00:00', '16:48:00', 'IMAX', 185000.00, 'ACTIVE'),
(3, 1, 3, CURRENT_DATE(), '19:30:00', '22:18:00', 'DOLBY', 160000.00, 'ACTIVE'),
(4, 3, 4, CURRENT_DATE(), '10:00:00', '11:50:00', '2D', 85000.00, 'ACTIVE'),
(5, 3, 5, CURRENT_DATE(), '15:15:00', '17:05:00', '3D', 110000.00, 'ACTIVE')
ON DUPLICATE KEY UPDATE `Price`=VALUES(`Price`);

-- --------------------------------------------------------
-- 9. Dữ liệu mẫu foods
-- --------------------------------------------------------
INSERT INTO `foods` (`FoodID`, `FoodName`, `Description`, `Price`, `ImageURL`, `Status`) VALUES
(1, 'Bắp rang bơ Caramel hảo hạng (L)', 'Bắp nổ nóng giòn phủ lớp sốt caramel thơm ngọt đậm đà', 65000.00, 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=400', 'ACTIVE'),
(2, 'Coca Cola Zero / Regular (L)', 'Nước giải khát có ga mát lạnh sảng khoái ly 32oz', 35000.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', 'ACTIVE'),
(3, 'Combo Đôi Hoàn Hảo (1 Bắp + 2 Nước)', '1 bắp lớn tùy chọn vị Caramel/Phô mai + 2 nước ngọt 32oz', 119000.00, 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=400', 'ACTIVE'),
(4, 'Snack Khoai tây chiên giòn sốt BBQ', 'Khoai tây thái lát sấy giòn rụm hương vị thịt nướng BBQ', 45000.00, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', 'ACTIVE')
ON DUPLICATE KEY UPDATE `FoodName`=VALUES(`FoodName`);

-- --------------------------------------------------------
-- 10. Dữ liệu mẫu promotions
-- --------------------------------------------------------
INSERT INTO `promotions` (`PromotionID`, `PromotionCode`, `PromotionName`, `DiscountType`, `DiscountValue`, `StartDate`, `EndDate`, `MinAmount`, `Status`) VALUES
(1, 'WELCOME10', 'Giảm 10% cho khách hàng mới', 'PERCENT', 10.00, '2026-01-01', '2026-12-31', 50000.00, 'ACTIVE'),
(2, 'CINE50K', 'Giảm 50.000đ cho đơn từ 250k', 'FIXED', 50000.00, '2026-01-01', '2026-12-31', 250000.00, 'ACTIVE')
ON DUPLICATE KEY UPDATE `PromotionName`=VALUES(`PromotionName`);
