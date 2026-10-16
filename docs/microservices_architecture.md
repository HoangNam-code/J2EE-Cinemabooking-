# KIẾN TRÚC HỆ THỐNG MICROSERVICES - CINEPRIME CINEMA PLATFORM

Tài liệu thiết kế kiến trúc chuyển đổi từ mô hình Monolith sang mô hình Hệ phân tán Microservices cho nền tảng Đặt vé xem phim trực tuyến **CinePrime Cinema**.

---

## 1. TỔNG QUAN VÀ BỐI CẢNH (OVERVIEW & CONTEXT)

Hệ thống đặt vé xem phim có đặc thù tải đột biến (High Traffic Spikes) vào các khung giờ vàng (giờ trưa, tối cuối tuần) hoặc khi ra mắt các bom tấn (Marvel, DC, Anime). Trong mô hình Monolith truyền thống, khi dịch vụ ghế ngồi và thanh toán bị nghẽn tải, toàn bộ hệ thống (kể cả việc xem thông tin phim) đều bị tê liệt.

Việc thiết kế và chuyển dịch sang kiến trúc **Microservices** đem lại các lợi thế chiến lược:
- **Khả năng co giãn độc lập (Independent Scalability):** Tự động scale các service chịu tải nặng như `Showtime & Seat Service`, `Booking Service` mà không tốn tài nguyên cho các service ít biến động như `Movie Catalog`.
- **Cô lập lỗi (Fault Isolation):** Lỗi sập cổng thanh toán hoặc nghẽn email không làm sập luồng tra cứu lịch chiếu và giữ ghế.
- **Tính linh hoạt công nghệ (Polyglot Persistence & Programming):** Dùng Redis cho Real-time Seat Hold, MySQL cho ACID Booking/Payment, MongoDB cho Movie Reviews, Python cho AI Recommendation.

---

## 2. BẢN ĐỒ KIẾN TRÚC TỔNG THỂ (HIGH-LEVEL ARCHITECTURE)

```
[ Client Layer ]
    │  Web Browser (React 18 SPA)
    │  Mobile App (Flutter / React Native)
    │  Staff Tablet (QR Scanner App)
    ▼
┌─────────────────────────────────────────────────────────────┐
│                 API GATEWAY (Spring Cloud Gateway)          │
│  - SSL Termination / CORS / Security Filtering              │
│  - Rate Limiting (Redis Token Bucket)                       │
│  - JWT Verification & Header Enrichment                     │
│  - Centralized Logging & Distributed Tracing (Micrometer)   │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
    ┌──────────▼──────────┐        ┌──────────▼──────────┐
    │  Service Discovery  │        │  Config Server      │
    │  (Netflix Eureka /  │        │  (Spring Cloud      │
    │   HashiCorp Consul) │        │   Config / Vault)   │
    └─────────────────────┘        └─────────────────────┘
               │
    ═══════════╪═══════════════════════════════════════════════
               │ Microservices Ecosystem (Docker / K8s)
    ┌──────────┴──────────┐
    │ 1. Auth & User Svc  │──▶ MySQL (Users, Roles, OIDC Tokens)
    └─────────────────────┘
    ┌─────────────────────┐
    │ 2. Movie Catalog Svc│──▶ MySQL / MongoDB + GraphQL Engine
    └─────────────────────┘
    ┌─────────────────────┐
    │ 3. Seat & Matrix Svc│──▶ Redis (Distributed Lock & 10-min Seat Hold)
    └─────────────────────┘
    ┌─────────────────────┐
    │ 4. Booking Order Svc│──▶ MySQL (Bookings, Tickets, Foods)
    └─────────────────────┘
    ┌─────────────────────┐
    │ 5. Payment Svc      │──▶ MySQL (Transactions, VNPay/MoMo Webhooks)
    └─────────────────────┘
    ┌─────────────────────┐
    │ 6. CineAI Recommender│──▶ Python FastAPI / Spring AI + Vector DB
    └─────────────────────┘
               │
               ▼ Asynchronous Message Broker
    ┌─────────────────────────────────────────────────────────┐
    │      EVENT BUS: Apache Kafka / RabbitMQ                 │
    │  Topics:                                                │
    │    - booking.created                                    │
    │    - payment.success / payment.failed                   │
    │    - ticket.generated                                   │
    │    - notification.send-email                            │
    └──────────────┬──────────────────────────────────────────┘
                   │
    ┌──────────────▼──────────┐
    │ 7. Notification Svc     │──▶ Spring Email (SMTP) / Twilio SMS / Firebase
    └─────────────────────────┘
```

---

## 3. CHI TIẾT TỪNG MICROSERVICE (SERVICES DECOMPOSITION)

### 3.1. API Gateway Service (Spring Cloud Gateway)
- **Công nghệ:** Spring Cloud Gateway, Project Reactor (Non-blocking I/O).
- **Trách nhiệm:**
  - Điểm vào duy nhất (Single Entry Point) cho tất cả client.
  - Định tuyến thông minh dựa trên đường dẫn:
    - `/api/v1/auth/**` ➔ `Auth Service`
    - `/api/v1/movies/**`, `/graphql/**` ➔ `Movie Catalog Service`
    - `/api/v1/showtimes/**`, `/api/v1/seats/**` ➔ `Seat & Matrix Service`
    - `/api/v1/bookings/**` ➔ `Booking Order Service`
    - `/api/v1/payments/**` ➔ `Payment Service`
    - `/api/v1/ai/**` ➔ `CineAI Service`
  - Tích hợp Redis Token Bucket hạn chế tấn công DDoS hoặc spam book vé (Rate Limiting: 50 requests/sec per IP).

### 3.2. Authentication & Identity Service
- **Trách nhiệm:** Quản lý tài khoản, mật khẩu (BCrypt), tích hợp Google/Facebook OAuth2, cấp phát và thu hồi JWT tokens.
- **Phân quyền (RBAC):** `ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN`.
- **Database:** `users`, `roles`, `refresh_tokens`.

### 3.3. Movie & Catalog Service (với Spring for GraphQL)
- **Trách nhiệm:** Quản lý danh mục phim, thể loại, thông tin rạp chiếu, phòng chiếu, công nghệ (IMAX, Dolby Cinema, 3D).
- **Giao thức:** Hỗ trợ song song REST API và **GraphQL** (`/graphql`, `/graphiql`). Khách hàng có thể truy vấn linh hoạt thông tin phim cùng danh sách suất chiếu mà không bị over-fetching hay under-fetching.
- **Cache:** Tích hợp Redis Cache (TTL 1 giờ) cho danh sách phim đang chiếu và sắp chiếu.

### 3.4. Showtime & Seat Management Service (High Performance)
- **Trách nhiệm:** Quản lý sơ đồ 84 ghế mỗi phòng, trạng thái ghế theo thời gian thực (Trống, Đang giữ, Đã bán).
- **Cơ chế Distributed Lock & Seat Hold:**
  - Sử dụng **Redis TTL (Key-Value: `seat_lock:{showtimeId}:{seatId}` với TTL 600 giây / 10 phút)**.
  - Ngăn ngừa xung đột đặt chỗ (Race condition) khi hàng trăm người dùng cùng bấm chọn ghế VIP (ví dụ: ghế D05, D06) tại cùng một tích tắc (Atomic Lua Script trên Redis).

### 3.5. Booking & Order Service
- **Trách nhiệm:** Khởi tạo đơn đặt vé, tính toán tổng tiền vé + bắp nước + mã giảm giá (Promotion code), quản lý vòng đời đơn (`PENDING` ➔ `PAID` ➔ `EXPIRED` / `CANCELLED`).
- **Database:** `bookings`, `tickets`, `bookingfoods`, `promotions`.

### 3.6. Payment Gateway Service
- **Trách nhiệm:** Tích hợp cổng thanh toán trực tuyến (VNPay SDK, MoMo API).
- **Cơ chế xử lý:**
  - Tạo URL thanh toán bảo mật với mã hóa HMAC-SHA512.
  - Tiếp nhận và xử lý Instant Payment Notification (IPN Webhook) đảm bảo tính toàn vẹn và idempotency (không trừ tiền 2 lần).
  - Xuất bản sự kiện `payment.success` vào Kafka topic khi thanh toán hoàn tất.

### 3.7. Notification Service (Event Consumer)
- **Trách nhiệm:** Lắng nghe sự kiện thanh toán từ Kafka, tạo mã QR vé dạng Base64/SVG, gửi email xác nhận đặt vé định dạng HTML sang trọng với thông tin vé và hướng dẫn check-in tại quầy.
- **Công nghệ:** Spring Boot Mail Starter, FreeMarker/Thymeleaf template, ZXing QR generator.

### 3.8. CineAI Movie Assistant Service
- **Trách nhiệm:** Trợ lý ảo AI hiểu ngôn ngữ tự nhiên, gợi ý phim theo sở thích, tâm trạng, thể loại và điều hướng đặt vé tức thì.
- **Công nghệ:** Python FastAPI (hoặc Spring Boot Controller với Spring AI / REST client) tích hợp mô hình ngôn ngữ lớn (LLM).

---

## 4. XỬ LÝ GIAO DỊCH PHÂN TÁN (DISTRIBUTED TRANSACTION & SAGA PATTERN)

Trong hệ thống Microservices, mỗi service sở hữu cơ sở dữ liệu riêng biệt (Database-per-Service). Quy trình đặt vé và thanh toán liên quan đến 3 service: `Seat Service`, `Booking Service`, và `Payment Service`.

Hệ thống áp dụng **Saga Pattern dạng Choreography (Hướng sự kiện)**:

```
[User]
   │ 1. Chọn ghế & Combo
   ▼
[Booking Service] ──(Tạo Booking PENDING)──▶ [Event: BookingCreated]
                                                    │
             ┌──────────────────────────────────────┘
             ▼
[Seat Service] ──▶ Khóa ghế trên Redis (TTL 10 phút)
             │
             ▼
[Payment Service] ──▶ Tạo VNPay URL ──▶ User thanh toán thành công
                                                │
                                                ▼
                                    [Event: PaymentSuccess]
                                                │
             ┌──────────────────────────────────┴──────────────────┐
             ▼                                                     ▼
[Booking Service]                                         [Notification Service]
- Cập nhật Booking = PAID                                 - Gửi Email vé kèm QR
- Cập nhật Ticket = VALID                                 - Gửi SMS thông báo
```

**Kịch bản Bù trừ khi Thanh toán thất bại hoặc Hết hạn (Compensating Transaction):**
- Nếu User hủy giao dịch hoặc quá 10 phút chưa thanh toán, Scheduled Worker hoặc `PaymentFailedEvent` sẽ kích hoạt:
  1. `Booking Service` cập nhật trạng thái đơn = `CANCELLED` hoặc `EXPIRED`.
  2. `Seat Service` tự động nhả khóa ghế trên Redis, giúp ghế hiển thị lại trạng thái trống trên màn hình cho người khác đặt.

---

## 5. BẢO MẬT & PHÂN QUYỀN TRONG MICROSERVICES (SECURITY ARCHITECTURE)

- **JWT Token Propagation:**
  - Người dùng đăng nhập qua `Auth Service` nhận về `Access Token` (JWT có hạn 1 giờ) và `Refresh Token` (7 ngày).
  - Khi gửi request tới `API Gateway`, Gateway giải mã và kiểm tra chữ ký RSA/HMAC của JWT.
  - Gateway trích xuất các claims: `X-User-Id`, `X-User-Email`, `X-User-Roles` và truyền vào HTTP Header chuyển tiếp (Forwarding Headers) cho các service nội bộ.
- **Mạng nội bộ an toàn (Private Network):**
  - Các microservice nội bộ và cơ sở dữ liệu nằm trong Docker network nội bộ (`cineprime-network`), không mở port ra Internet ngoại trừ Gateway (Port 80/443).

---

## 6. CHIẾN LƯỢC TRIỂN KHAI CLOUD (DEPLOYMENT STRATEGY)

### 6.1. Triển khai Docker Swarm / Kubernetes (K8s)
- **Deployment & Service:** Mỗi Microservice được đóng gói thành Docker Image nhẹ (< 200MB trên Alpine Linux) và triển khai với Replica set tối thiểu là 2 pods để đảm bảo High Availability (HA).
- **Horizontal Pod Autoscaling (HPA):** Tự động scale `Seat Service` và `Booking Service` từ 2 pods lên 10 pods khi CPU vượt ngưỡng 75%.
- **Ingress Controller:** Nginx Ingress Controller phụ trách SSL/TLS Let's Encrypt tự động gia hạn.

### 6.2. Triển khai Nhanh trên Nền tảng PaaS (Render / Railway / AWS ECS)
1. **Database:** Cung cấp Managed MySQL trên Aiven hoặc AWS RDS.
2. **Cache & Lock:** Cung cấp Upstash Redis hoặc AWS ElastiCache.
3. **Backend Container:** Đẩy Docker image lên Docker Hub / GitHub Container Registry (GHCR), thiết lập CI/CD pipeline qua GitHub Actions để tự động build và deploy.
4. **Frontend:** Triển khai trên Vercel hoặc Cloudflare Pages với Edge CDN toàn cầu, kết nối API backend thông qua Custom Domain.

---
*Tài liệu được biên soạn nhằm phục vụ kiểm định đồ án kiến trúc phần mềm J2EE chuyên sâu và thuyết minh đề tài Seminar Microservices & Spring for GraphQL.*
