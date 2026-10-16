# CinePrime - J2EE Cinema Booking Platform 🎬🍿

> Hệ thống website đặt vé xem phim trực tuyến hiện đại, xây dựng trên nền tảng kiến trúc phân tách Client - Server (React 18 Vite + Spring Boot 3 JPA & GraphQL), tích hợp thanh toán VNPAY, gửi vé qua email và hệ thống quản trị rạp phim toàn diện.

---

## 🌟 Tính Năng Nổi Bật (Key Features)

1. **Khách hàng (Customer Experience):**
   - Xem danh sách phim đang chiếu / sắp chiếu với hơn **85+ bộ phim chiếu rạp thực tế** (cập nhật từ CellphoneS Sforum).
   - Xem chi tiết phim, thể loại, thời lượng, trailer YouTube, lịch chiếu theo ngày và cụm rạp.
   - Chọn ghế trực quan (Ghế Thường, VIP, Couple) theo thời gian thực với sơ đồ phòng chiếu uốn cong mô phỏng rạp chiếu chuẩn quốc tế.
   - Chọn combo bắp nước đa dạng, áp dụng mã giảm giá / khuyến mãi.
   - **Thanh toán trực tuyến:** Tích hợp cổng thanh toán **VNPAY Sandbox**, chuyển khoản ngân hàng và tiền mặt tại quầy.
   - **Vé điện tử & QR Code:** Xem vé đã đặt, tự động sinh mã QR Code để quét vé tại quầy soát vé.
   - **Gửi Email tự động:** Tự động gửi thông tin vé và hướng dẫn nhận vé về email khách hàng qua **Spring Mail**.

2. **Quản trị viên & Nhân viên (Admin & Staff Portal):**
   - **Phân quyền người dùng (RBAC 3 cấp độ):** `ADMIN`, `STAFF`, `CUSTOMER`.
   - **Quản lý Thể loại Phim (Genres):** Tạo, chỉnh sửa, lọc phim theo thể loại, đếm số lượng phim theo từng thể loại.
   - **Quản lý Phim (Movies):** Thêm mới, cập nhật poster, trailer URL, trạng thái (Đang chiếu / Sắp chiếu / Ngừng chiếu), gắn thể loại đa dạng.
   - **Quản lý Lịch chiếu (Showtimes):** Lập lịch chiếu linh hoạt theo phòng chiếu, ngày và khung giờ.
   - **Quản lý Đơn đặt vé (Bookings):** Theo dõi trạng thái vé, doanh thu, thanh toán.

3. **Công nghệ đặc biệt (Seminar & Modern Specs):**
   - **Spring for GraphQL:** Truy vấn linh hoạt danh sách phim, thể loại và lịch chiếu với hiệu năng tối ưu (`/graphql` & GraphiQL Explorer).
   - **RESTful API + Spring Security + JWT:** Bảo mật stateless, phân quyền chặt chẽ theo URL và Token.
   - **Spring Data JPA & Hibernate:** Ánh xạ quan hệ cơ sở dữ liệu hoàn chỉnh, transaction an toàn tránh trùng ghế (double-booking).

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

### Backend
- **Ngôn ngữ & Framework:** Java 17, Spring Boot 3.2.x
- **Bảo mật:** Spring Security, JWT (JSON Web Tokens)
- **Truy vấn & API:** Spring Web (RESTful API), Spring for GraphQL
- **Database & ORM:** MySQL 8.x, Spring Data JPA, Hibernate
- **Tiện ích:** Spring Boot Starter Mail, VNPAY Payment Gateway SDK, Lombok

### Frontend
- **Framework & Build Tool:** React 18, Vite
- **Styling:** Tailwind CSS, Lucide React Icons
- **Quản lý trạng thái & Router:** React Router DOM v6, React Context API
- **Tiện ích:** Sonner (Toast notifications), QRCode.react (Mã QR vé điện tử)

### Database
- **MySQL Database:** Bảng dữ liệu quan hệ chuẩn hóa (`users`, `roles`, `movies`, `categories`, `movie_categories`, `cinemas`, `rooms`, `seats`, `showtimes`, `bookings`, `tickets`, `foods`, `booking_foods`, `payments`, `promotions`).
- Dữ liệu mẫu phong phú: **85 phim chiếu rạp**, 330+ lịch chiếu và đầy đủ ghế cho tất cả phòng chiếu.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Getting Started)

### 1. Chuẩn bị môi trường
- **Java JDK 17+** (đã cấu hình `JAVA_HOME`)
- **Node.js 18+** & npm
- **MySQL Server** (XAMPP / MySQL Community Server đang chạy ở port `3306`)

### 2. Cài đặt Cơ sở dữ liệu (Database Setup)
1. Mở **phpMyAdmin** (XAMPP) hoặc MySQL Workbench:
   ```sql
   CREATE DATABASE cinemabooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Import file database có sẵn dữ liệu phim rạp:
   - File: `database/import_cellphones_movies.sql` (hoặc `database/cinemabooking.sql`)

### 3. Khởi chạy Backend (Spring Boot)
```bash
cd backend
# Cấu hình database trong src/main/resources/application.properties nếu có thay đổi mật khẩu root
./mvnw spring-boot:run
```
> Backend sẽ chạy tại: **http://localhost:8088**  
> GraphiQL UI: **http://localhost:8088/graphiql**

### 4. Khởi chạy Frontend (React Vite)
```bash
cd frontend
npm install
npm run dev
```
> Frontend sẽ chạy tại: **http://localhost:5173**

---

## 👥 Tài Khoản Mặc Định (Demo Accounts)

| Vai trò (Role) | Tên đăng nhập (Username) | Mật khẩu (Password) | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (ADMIN)** | `admin` | `admin123` | Toàn quyền quản trị hệ thống, phim, thể loại, rạp, nhân sự |
| **Nhân viên (STAFF)** | `staff` | `staff123` | Quản lý lịch chiếu, duyệt vé, xem đơn đặt vé |
| **Khách hàng (CUSTOMER)** | `user1` | `user123` | Đặt vé, chọn ghế, mua bắp nước, thanh toán VNPAY |

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```
CinemaBooking_Project/
├── backend/                  # Source code Spring Boot 3 Backend
│   ├── src/main/java/        # Controllers, Services, Repositories, Entities, GraphQL Resolvers
│   ├── src/main/resources/   # application.properties, graphql schema, mail templates
│   └── pom.xml
├── frontend/                 # Source code React Vite Frontend
│   ├── src/components/       # UI Components (Navbar, Footer, SeatMap, TicketPassModal...)
│   ├── src/pages/            # HomePage, MovieDetailPage, BookingSeatPage, PaymentPage, Admin...
│   └── package.json
├── database/                 # Script tạo bảng và nạp dữ liệu phim thực tế (85+ phim)
│   ├── cinemabooking.sql
│   └── import_cellphones_movies.sql
├── docs/                     # Tài liệu thiết kế hệ thống, sơ đồ kiến trúc & báo cáo
└── README.md
```

---

## 👨‍💻 Tác giả & Đồ Án
- **Đồ án:** Phát triển ứng dụng Web J2EE - Hệ thống đặt vé xem phim CinePrime
- **Sinh viên thực hiện:** Đặng Hoàng Nam ([@HoangNam-code](https://github.com/HoangNam-code))
