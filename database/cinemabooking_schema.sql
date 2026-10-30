-- ========================================================
-- CINEPRIME - CINEMA BOOKING SYSTEM DATABASE SCHEMA
-- Hệ quản trị CSDL: MySQL / MariaDB (XAMPP tương thích)
-- Tập tin: cinemabooking_schema.sql
-- ========================================================

CREATE DATABASE IF NOT EXISTS `cinemabooking`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `cinemabooking`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `bookingpromotions`;
DROP TABLE IF EXISTS `promotions`;
DROP TABLE IF EXISTS `tickets`;
DROP TABLE IF EXISTS `bookingfoods`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `foods`;
DROP TABLE IF EXISTS `showtimes`;
DROP TABLE IF EXISTS `seats`;
DROP TABLE IF EXISTS `rooms`;
DROP TABLE IF EXISTS `cinemas`;
DROP TABLE IF EXISTS `moviecategories`;
DROP TABLE IF EXISTS `movies`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- 1. Bảng: users (Khách hàng, Nhân viên, Quản trị viên)
-- --------------------------------------------------------
CREATE TABLE `users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `Email` varchar(191) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Role` enum('CUSTOMER','STAFF','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `Status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `UQ_Users_Username` (`Username`),
  UNIQUE KEY `UQ_Users_Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Bảng: categories (Thể loại phim)
-- --------------------------------------------------------
CREATE TABLE `categories` (
  `CategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(100) NOT NULL,
  `Description` varchar(500) DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`CategoryID`),
  UNIQUE KEY `UQ_Categories_Name` (`CategoryName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Bảng: movies (Thông tin bộ phim)
-- --------------------------------------------------------
CREATE TABLE `movies` (
  `MovieID` int(11) NOT NULL AUTO_INCREMENT,
  `MovieName` varchar(200) NOT NULL,
  `Duration` int(11) NOT NULL COMMENT 'Thời lượng phim tính theo phút',
  `Director` varchar(200) DEFAULT NULL,
  `Actors` varchar(1000) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `ReleaseDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `PosterURL` varchar(500) DEFAULT NULL,
  `TrailerURL` varchar(500) DEFAULT NULL,
  `Status` enum('COMING_SOON','NOW_SHOWING','ENDED') NOT NULL DEFAULT 'COMING_SOON',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`MovieID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Bảng: moviecategories (Quan hệ Nhiều - Nhiều Phim & Thể loại)
-- --------------------------------------------------------
CREATE TABLE `moviecategories` (
  `MovieID` int(11) NOT NULL,
  `CategoryID` int(11) NOT NULL,
  PRIMARY KEY (`MovieID`, `CategoryID`),
  KEY `FK_MovieCategories_Categories` (`CategoryID`),
  CONSTRAINT `FK_MovieCategories_Movies` FOREIGN KEY (`MovieID`) REFERENCES `movies` (`MovieID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_MovieCategories_Categories` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Bảng: cinemas (Cụm rạp chiếu phim)
-- --------------------------------------------------------
CREATE TABLE `cinemas` (
  `CinemaID` int(11) NOT NULL AUTO_INCREMENT,
  `CinemaName` varchar(200) NOT NULL,
  `Address` varchar(500) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`CinemaID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Bảng: rooms (Phòng chiếu theo cụm rạp)
-- --------------------------------------------------------
CREATE TABLE `rooms` (
  `RoomID` int(11) NOT NULL AUTO_INCREMENT,
  `CinemaID` int(11) NOT NULL,
  `RoomName` varchar(100) NOT NULL,
  `RoomType` varchar(20) NOT NULL DEFAULT '2D',
  `Capacity` int(11) NOT NULL,
  `Status` enum('ACTIVE','INACTIVE','MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RoomID`),
  KEY `FK_Rooms_Cinemas` (`CinemaID`),
  CONSTRAINT `FK_Rooms_Cinemas` FOREIGN KEY (`CinemaID`) REFERENCES `cinemas` (`CinemaID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Bảng: seats (Sơ đồ ghế ngồi trong phòng)
-- --------------------------------------------------------
CREATE TABLE `seats` (
  `SeatID` int(11) NOT NULL AUTO_INCREMENT,
  `RoomID` int(11) NOT NULL,
  `SeatCode` varchar(10) NOT NULL COMMENT 'Mã hiển thị, vd: A01, B12',
  `RowName` varchar(10) NOT NULL COMMENT 'Hàng ghế, vd: A, B, C',
  `SeatNumber` int(11) NOT NULL COMMENT 'Số thứ tự ghế trong hàng',
  `SeatType` enum('NORMAL','VIP','COUPLE') NOT NULL DEFAULT 'NORMAL',
  `Status` enum('ACTIVE','INACTIVE','MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SeatID`),
  UNIQUE KEY `UQ_Seats_Room_Seat` (`RoomID`,`SeatCode`),
  CONSTRAINT `FK_Seats_Rooms` FOREIGN KEY (`RoomID`) REFERENCES `rooms` (`RoomID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. Bảng: showtimes (Lịch suất chiếu)
-- --------------------------------------------------------
CREATE TABLE `showtimes` (
  `ShowtimeID` int(11) NOT NULL AUTO_INCREMENT,
  `MovieID` int(11) NOT NULL,
  `RoomID` int(11) NOT NULL,
  `ShowDate` date NOT NULL,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL,
  `Format` varchar(20) NOT NULL DEFAULT '2D',
  `Price` decimal(12,2) NOT NULL COMMENT 'Giá vé cơ bản cho suất chiếu',
  `Status` enum('ACTIVE','CANCELLED','COMPLETED') NOT NULL DEFAULT 'ACTIVE',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ShowtimeID`),
  KEY `IX_Showtimes_Room_Date` (`RoomID`,`ShowDate`),
  KEY `IX_Showtimes_Movie_Date` (`MovieID`,`ShowDate`),
  CONSTRAINT `FK_Showtimes_Movies` FOREIGN KEY (`MovieID`) REFERENCES `movies` (`MovieID`) ON UPDATE CASCADE,
  CONSTRAINT `FK_Showtimes_Rooms` FOREIGN KEY (`RoomID`) REFERENCES `rooms` (`RoomID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Bảng: foods (Danh mục Bắp / Nước / Combo)
-- --------------------------------------------------------
CREATE TABLE `foods` (
  `FoodID` int(11) NOT NULL AUTO_INCREMENT,
  `FoodName` varchar(150) NOT NULL,
  `Description` varchar(300) DEFAULT NULL,
  `Price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `ImageURL` varchar(500) DEFAULT NULL,
  `Status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`FoodID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. Bảng: bookings (Đơn đặt vé có ExpiresAt để giữ ghế tạm thời)
-- --------------------------------------------------------
CREATE TABLE `bookings` (
  `BookingID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `BookingDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ExpiresAt` datetime DEFAULT NULL COMMENT 'Hạn chót thanh toán (giữ ghế 10 phút)',
  `TotalAmount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `Status` enum('PENDING','PAID','CANCELLED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`BookingID`),
  KEY `IX_Bookings_UserID` (`UserID`),
  KEY `IX_Bookings_Status` (`Status`),
  CONSTRAINT `FK_Bookings_Users` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 11. Bảng: bookingfoods (Chi tiết bắp nước theo đơn đặt vé)
-- --------------------------------------------------------
CREATE TABLE `bookingfoods` (
  `BookingID` int(11) NOT NULL,
  `FoodID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `Price` decimal(12,2) NOT NULL COMMENT 'Đơn giá tại thời điểm mua',
  PRIMARY KEY (`BookingID`, `FoodID`),
  KEY `FK_BookingFoods_Foods` (`FoodID`),
  CONSTRAINT `FK_BookingFoods_Bookings` FOREIGN KEY (`BookingID`) REFERENCES `bookings` (`BookingID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_BookingFoods_Foods` FOREIGN KEY (`FoodID`) REFERENCES `foods` (`FoodID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 12. Bảng: tickets (Chi tiết vé & Ghế đã đặt)
-- --------------------------------------------------------
CREATE TABLE `tickets` (
  `TicketID` int(11) NOT NULL AUTO_INCREMENT,
  `BookingID` int(11) NOT NULL,
  `ShowtimeID` int(11) NOT NULL,
  `SeatID` int(11) NOT NULL,
  `Price` decimal(12,2) NOT NULL,
  `Status` enum('VALID','USED','CANCELLED') NOT NULL DEFAULT 'VALID',
  `QRCode` varchar(500) DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ActiveSeatKey` varchar(50) GENERATED ALWAYS AS (if(`Status` <> 'CANCELLED',concat(`ShowtimeID`,'_',`SeatID`),NULL)) STORED,
  PRIMARY KEY (`TicketID`),
  UNIQUE KEY `UQ_Tickets_Showtime_Seat` (`ActiveSeatKey`),
  KEY `FK_Tickets_Bookings` (`BookingID`),
  KEY `FK_Tickets_Showtimes` (`ShowtimeID`),
  KEY `FK_Tickets_Seats` (`SeatID`),
  CONSTRAINT `FK_Tickets_Bookings` FOREIGN KEY (`BookingID`) REFERENCES `bookings` (`BookingID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_Tickets_Showtimes` FOREIGN KEY (`ShowtimeID`) REFERENCES `showtimes` (`ShowtimeID`) ON UPDATE CASCADE,
  CONSTRAINT `FK_Tickets_Seats` FOREIGN KEY (`SeatID`) REFERENCES `seats` (`SeatID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 13. Bảng: promotions (Chương trình khuyến mãi & Mã giảm giá)
-- --------------------------------------------------------
CREATE TABLE `promotions` (
  `PromotionID` int(11) NOT NULL AUTO_INCREMENT,
  `PromotionCode` varchar(50) NOT NULL,
  `PromotionName` varchar(200) NOT NULL,
  `DiscountType` enum('PERCENT','FIXED') NOT NULL,
  `DiscountValue` decimal(12,2) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `MinAmount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `Status` enum('ACTIVE','INACTIVE','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PromotionID`),
  UNIQUE KEY `UQ_Promotions_Code` (`PromotionCode`),
  KEY `IX_Promotions_Dates` (`StartDate`,`EndDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 14. Bảng: bookingpromotions (Lịch sử áp dụng mã cho đơn hàng)
-- --------------------------------------------------------
CREATE TABLE `bookingpromotions` (
  `BookingID` int(11) NOT NULL,
  `PromotionID` int(11) NOT NULL,
  `DiscountAmount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`BookingID`,`PromotionID`),
  KEY `FK_BookingPromotions_Promotions` (`PromotionID`),
  CONSTRAINT `FK_BookingPromotions_Bookings` FOREIGN KEY (`BookingID`) REFERENCES `bookings` (`BookingID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_BookingPromotions_Promotions` FOREIGN KEY (`PromotionID`) REFERENCES `promotions` (`PromotionID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 15. Bảng: payments (Giao dịch thanh toán)
-- --------------------------------------------------------
CREATE TABLE `payments` (
  `PaymentID` int(11) NOT NULL AUTO_INCREMENT,
  `BookingID` int(11) NOT NULL,
  `Amount` decimal(12,2) NOT NULL,
  `Method` enum('CASH','BANKING','MOMO','VNPAY','CARD','PAYOS') NOT NULL,
  `PaymentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `TransactionID` varchar(100) DEFAULT NULL COMMENT 'Mã giao dịch từ cổng thanh toán',
  `Status` enum('PENDING','SUCCESS','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PaymentID`),
  UNIQUE KEY `UQ_Payments_BookingID` (`BookingID`),
  KEY `IX_Payments_TransactionID` (`TransactionID`),
  KEY `IX_Payments_Status` (`Status`),
  CONSTRAINT `FK_Payments_Bookings` FOREIGN KEY (`BookingID`) REFERENCES `bookings` (`BookingID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
