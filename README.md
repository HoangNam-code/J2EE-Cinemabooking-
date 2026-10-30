# 🎬 CINEPRIME - HỆ THỐNG ĐẶT VÉ XEM PHIM TRỰC TUYẾN CHUẨN DOANH NGHIỆP 🍿

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen?style=for-the-badge&logo=springboot)
![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![GraphQL](https://img.shields.io/badge/Spring%20GraphQL-Seminar-E10098?style=for-the-badge&logo=graphql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

<p align="center">
  <b>Đồ Án Môn Học: Phát Triển Ứng Dụng Web J2EE / Java Doanh Nghiệp</b><br>
  Kiến trúc phân tách Client - Server hiện đại (React 18 SPA + Spring Boot RESTful & GraphQL API), tích hợp thanh toán trực tuyến VNPAY, gửi email xác thực OTP, hệ thống vé điện tử mã QR và phân quyền 3 cấp độ.
</p>

[Xem Hướng Dẫn Cài Đặt](#-hướng-dẫn-cài-đặt--khởi-chạy) • [Tài Khoản Thử Nghiệm](#-tài-khoản-thử-nghiệm-demo-accounts) • [Bảng Đáp Ứng Yêu Cầu Đồ Án](#-bảng-tổng-hợp-đáp-ứng-yêu-cầu-đồ-án) • [Cấu Trúc Thư Mục](#-cấu-trúc-dự-án)

</div>

---

## 📋 Bảng Tổng Hợp Đáp Ứng Yêu Cầu Đồ Án

Hệ thống được thiết kế và hoàn thiện vượt mức các tiêu chí đánh giá đồ án cuối kỳ:

| STT | Yêu cầu đồ án | Tình trạng | Giải pháp công nghệ & Hiện thực |
| :---: | :--- | :---: | :--- |
| **1** | **Login Gmail / Facebook & OTP Email** | ✅ Hoàn thành | Đăng nhập Google Sign-In chính thức (xác thực Google ID Token qua Google Identity Services) & Facebook OAuth; Gửi mã xác thực **OTP 6 chữ số** về Email người dùng qua **Spring Email** trước khi hoàn tất tạo tài khoản. |
| **2** | **Phân quyền người dùng (Tối thiểu 3 nhóm)** | ✅ Hoàn thành | Hệ thống RBAC 3 cấp độ: `ADMIN` (Quản trị toàn diện), `STAFF` (Vận hành rạp: Soát vé, kho bắp nước, khóa ghế), `CUSTOMER` (Khách đặt vé, xem QR vé). Bảo mật cả Backend Spring Security và Frontend Route Guards. |
| **3** | **Thanh toán trực tuyến VNPay / VietQR PayOS / MoMo** | ✅ Hoàn thành | Tích hợp đa cổng thanh toán: Cổng **VNPay Sandbox** (chữ ký số SHA512) và Cổng **VietQR PayOS** quét mã QR chuyển khoản ngân hàng tự động kèm Webhook IPN đồng bộ trạng thái đơn vé thời gian thực. |
| **4** | **Làm việc với DB qua Spring Data JPA** | ✅ Hoàn thành | 13 Thực thể JPA Entity, Composite Key (`@Embeddable` & `@EmbeddedId`), JPQL Queries, quan hệ One-to-Many / Many-to-Many, Transaction Isolation `SERIALIZABLE` chống xung đột giữ ghế. |
| **5** | **Gửi email bằng Spring Email** | ✅ Hoàn thành | Tích hợp `JavaMailSender`, gửi mail bất đồng bộ (Non-blocking Async) qua SMTP Gmail: gửi mã OTP đăng ký, gửi vé điện tử kèm **hình ảnh mã QR Code** sau khi thanh toán, gửi thông báo hủy vé. |
| **6** | **Tổ chức dự án (Frontend + Backend riêng)** | ✅ Hoàn thành | Dự án phân tách hoàn toàn thành 2 module độc lập: `/backend` (Maven, Spring Boot) và `/frontend` (Vite, React), giao tiếp qua RESTful JSON API và GraphQL. |
| **7** | **Giao diện dễ nhìn (Tối thiểu 10 màn hình)** | ✅ Hoàn thành | **12 màn hình lớn** phong cách điện ảnh cao cấp Dark & Gold Cinema Luxury (Home, Detail, Seat Map, Combo, Checkout, Result, My Tickets, Login, Register, Staff Console, Admin Dashboard, Widget AI). |
| **8** | **Viết báo cáo đầy đủ** | ✅ Hoàn thành | Toàn bộ tài liệu kiến trúc, báo cáo phân tích, Postman API Collection được lưu trữ đầy đủ trong thư mục [`/docs`](./docs). |
| **9** | **Source code tổ chức tốt, sạch sẽ** | ✅ Hoàn thành | Cấu trúc chuẩn Clean Architecture, không mã thừa, đã dọn dẹp các tệp rác, biên dịch 0 lỗi cả Frontend và Backend. |
| **+** | **Điểm cộng nâng cao** | 🌟 Xuất sắc | - **Microservices Architecture:** Đã có tài liệu thiết kế chia tách microservice chi tiết.<br>- **Tích hợp Trợ lý ảo AI:** Widget CineAI tư vấn phim thông minh.<br>- **Seminar Công nghệ:** Tích hợp **Spring for GraphQL** (`/graphql`, GraphiQL Explorer).<br>- **Triển khai Container:** File `docker-compose.yml` khởi chạy 1-click toàn bộ hệ thống. |

---

## 🌟 Trải Nghiệm 3 Nhóm Người Dùng (Role-Based Matrix)

```
                            ┌───────────────────────────────┐
                            │    CINEPRIME ACCESS MATRIX    │
                            └───────────────┬───────────────┘
                                            │
            ┌───────────────────────────────┼───────────────────────────────┐
            │                               │                               │
     [CUSTOMER - Khách Hàng]         [STAFF - Nhân Viên Rạp]          [ADMIN - Quản Trị Viên]
     • Khám phá 85+ phim rạp         • Cổng Soát Vé QR Code           • Dashboard doanh thu tổng
     • Sơ đồ ghế động real-time      • Quản lý kho Bắp - Nước         • Quản lý phim, thể loại
     • Menu Combo Căng tin           • Khóa ghế phòng chiếu bảo trì   • Lên lịch & suất chiếu rạp
     • Thanh toán online VNPay       • Cửa sổ bàn làm việc rạp        • Quản lý & phân quyền tài khoản
     • Ví vé điện tử mã QR cá nhân   • (Bị chặn khỏi trang Admin)     • Full quyền truy cập hệ thống
```

---

## 👥 Tài Khoản Thử Nghiệm (Demo Accounts)

Hệ thống có sẵn các tài khoản demo để thầy cô và người dùng nghiệm thu ngay:

| Vai trò (Role) | Tên đăng nhập | Mật khẩu | Quyền hạn & Chức năng kiểm tra |
| :--- | :---: | :---: | :--- |
| **Quản trị viên (ADMIN)** | `admin` | `123456` | Toàn quyền truy cập `/admin`: Quản lý danh mục phim, thể loại, suất chiếu, phân bổ quyền tài khoản, xem thống kê doanh thu. |
| **Nhân viên (STAFF)** | `staff01` | `123456` | Truy cập `/staff/scanner`: Soát vé QR, bật/tắt Còn hàng/Hết hàng bắp nước, nhấp chuột để khóa/mở ghế bảo trì phòng chiếu. |
| **Khách hàng (CUSTOMER)** | `customer01` | `123456` | Đặt vé, giữ chỗ ghế rạp, chọn combo bắp nước, thanh toán VNPay, nhận vé và mã QR tại `/my-tickets`. |

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Chuẩn bị môi trường
- **Java JDK 17+** (đã cấu hình `JAVA_HOME`)
- **Node.js 18+** & npm
- **MySQL 8.x** (Cổng `3306`, user: `root`, mật khẩu: trống hoặc cấu hình tương ứng)

---

### 2. Khởi tạo Cơ sở dữ liệu (MySQL Setup)
1. Tạo database trong MySQL (qua phpMyAdmin hoặc MySQL Workbench):
   ```sql
   CREATE DATABASE cinemabooking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Thực thi nạp dữ liệu từ thư mục `/database`:
   - Bước 1: Chạy file `database/cinemabooking_schema.sql` (Tạo cấu trúc bảng, khóa ngoại).
   - Bước 2: Chạy file `database/cinemabooking_sample_data.sql` (Nạp dữ liệu mẫu ban đầu).
   - Bước 3: Chạy file `database/update_seats_84.sql` (Nạp ma trận ghế rạp chuẩn).
   - Bước 4: Chạy file `database/import_cellphones_movies.sql` (Nạp hơn 85+ phim chiếu rạp thực tế).

---

### 3. Khởi chạy Backend (Spring Boot)
```bash
cd backend
# Cấu hình lại mật khẩu MySQL (nếu có) tại src/main/resources/application.properties
./mvnw spring-boot:run
```
- **RESTful API Base:** `http://localhost:8088/api/v1`
- **Swagger OpenAPI Docs:** `http://localhost:8088/swagger-ui.html`
- **Seminar GraphiQL IDE:** `http://localhost:8088/graphiql`

---

### 4. Khởi chạy Frontend (React Vite)
Mở một cửa sổ Terminal mới:
```bash
cd frontend
npm install
npm run dev
```
- **Giao diện Website:** `http://localhost:5173`

---

### 5. Khởi chạy 1-Click bằng Docker (Tùy chọn)
Nếu máy bạn đã cài sẵn **Docker & Docker Compose**:
```bash
docker-compose up --build -d
```
Docker sẽ tự động kích hoạt cả 3 container: CSDL MySQL (`:3306`), Backend Spring Boot (`:8088`) và Frontend Nginx (`:80`).

---

## 📂 Cấu Trúc Mã Nguồn (Project Structure)

```text
CinemaBooking_Project/
├── backend/                              # [Dự án Backend - Spring Boot 3.3.4]
│   ├── src/main/java/Ticket_Movie/demo/
│   │   ├── config/                       # SecurityConfig, CorsConfig, SwaggerConfig, VnpayConfig
│   │   ├── controller/                   # Auth, Movie, Booking, Payment, Staff, Admin, AI...
│   │   │   ├── admin/                    # Các Controller dành riêng cho Quản trị viên
│   │   │   └── graphql/                  # CinemaGraphQLController (Seminar GraphQL)
│   │   ├── dto/                          # Request & Response Data Transfer Objects
│   │   ├── entity/                       # 13 JPA Entities (User, Movie, Seat, Booking, Ticket...)
│   │   ├── exception/                    # GlobalExceptionHandler, AppException
│   │   ├── repository/                   # 12 Spring Data JPA Repositories
│   │   ├── schedule/                     # Cron task tự động quét nhả ghế hết hạn
│   │   ├── security/                     # JwtTokenProvider, JwtAuthFilter, UserDetailsService
│   │   └── service/ & service/impl/      # Tầng nghiệp vụ cốt lõi & giao dịch @Transactional
│   ├── src/main/resources/
│   │   ├── application.properties        # Cấu hình CSDL, JWT, VNPAY, Gmail SMTP, GraphQL
│   │   └── graphql/schema.graphqls       # Định nghĩa Schema cho Spring for GraphQL
│   ├── Dockerfile                        # Dockerfile đóng gói Backend
│   └── pom.xml                           # Quản lý thư viện Maven
│
├── frontend/                             # [Dự án Frontend - React 18 & Vite]
│   ├── src/
│   │   ├── api/                          # Axios Client, REST API & GraphQL Fetchers
│   │   ├── components/                   # UI Components (Navbar, Footer, SeatMap, Popups...)
│   │   ├── pages/                        # 12 màn hình giao diện chính
│   │   │   └── admin/                    # DashboardPage quản trị đa tab
│   │   ├── router/                       # React Router v6 với AdminRoute, StaffRoute, ProtectedRoute
│   │   ├── store/                        # AuthContext quản lý trạng thái phiên đăng nhập
│   │   └── index.css                     # TailwindCSS & hiệu ứng điện ảnh Dark Gold
│   ├── Dockerfile                        # Dockerfile đóng gói Frontend SPA qua Nginx
│   └── package.json                      # Quản lý thư viện Node/React
│
├── database/                             # Tập lệnh SQL Schema và dữ liệu 85+ phim chiếu rạp
├── docs/                                 # Tài liệu báo cáo, kiến trúc Microservice, Postman Collection
├── docker-compose.yml                    # Kịch bản triển khai toàn diện hệ thống
└── README.md                             # Tài liệu thuyết minh dự án
```

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

### Phía Backend
- **Core:** Java 17, Spring Boot 3.3.4 (Spring Web, Spring Security, Spring Data JPA, Spring Mail).
- **Seminar Công Nghệ:** Spring for GraphQL (Truy vấn dữ liệu hiệu năng cao).
- **Cơ Sở Dữ Liệu:** MySQL 8.0, Hibernate ORM 6.5, HikariCP Connection Pool.
- **Bảo Mật:** JSON Web Token (JWT Bearer Stateless), BCrypt Password Encoder, Google API Client (`google-api-client 2.7.0`).
- **Thanh Toán:** Đa kênh trực tuyến gồm VNPay Payment Gateway (Chữ ký điện tử SHA512) & VietQR PayOS (Chữ ký HMAC-SHA256, chuyển khoản ngân hàng tự động).
- **Trí Tuệ Nhân Tạo:** Google Gemini API Client (Trợ lý CineAI).
- **Tài Liệu Hóa API:** Springdoc OpenAPI & Swagger UI.

### Phía Frontend
- **Core:** React 18, Vite 5, React Router v6, React Context API.
- **Styling & Icons:** Tailwind CSS 3.4, Lucide React Icons.
- **UX & Utilities:** Sonner (Toast Alert Notifications), Canvas Confetti, QR Code Generator.
- **HTTP & Client:** Fetch API, Axios.

---

## 👨‍💻 Tác Giả & Bản Quyền
- **Đồ án môn học:** Phát triển ứng dụng Web phân tán J2EE / Java Doanh nghiệp
- **Sinh viên thực hiện:** Đặng Hoàng Nam ([@HoangNam-code](https://github.com/HoangNam-code))
- **Mã nguồn GitHub:** [https://github.com/HoangNam-code/J2EE-Cinemabooking-](https://github.com/HoangNam-code/J2EE-Cinemabooking-)
