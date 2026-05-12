# Web Thời Trang - Backend API

Backend API cho ứng dụng thương mại điện tử thời trang xây dựng bằng **Spring Boot**, **PostgreSQL**, và **Docker**.

## 📋 Cấu Trúc Dự Án

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/backend/
│   │   │   ├── entity/          # JPA Entities
│   │   │   ├── repository/      # Spring Data Repositories
│   │   │   ├── service/         # Business Logic (tùy chọn)
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── config/          # Configuration classes
│   │   │   └── BackendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
├── Dockerfile.backend
├── .env
└── mvnw
```

## 🚀 Chạy Ứng Dụng

### Option 1: Docker Compose (Recommended)

```bash
# Từ thư mục root của project
docker-compose up -d

# Kiểm tra logs
docker-compose logs -f backend

# Dừng ứng dụng
docker-compose down
```

### Option 2: Chạy Locally

**Yêu cầu:**
- Java 21+
- Maven 3.9+
- PostgreSQL 16+

**Cài đặt:**

1. Tạo database:
```sql
CREATE DATABASE webthoitrang;
```

2. Chạy backend:
```bash
cd backend
mvn spring-boot:run
```

3. Hoặc build và chạy JAR:
```bash
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## 🔌 API Endpoints

### Sản Phẩm
- `GET /api/san-pham` - Lấy tất cả sản phẩm
- `GET /api/san-pham/{id}` - Lấy sản phẩm theo ID
- `POST /api/san-pham` - Tạo sản phẩm
- `PUT /api/san-pham/{id}` - Cập nhật sản phẩm
- `DELETE /api/san-pham/{id}` - Xóa sản phẩm

### Danh Mục
- `GET /api/danh-muc` - Lấy tất cả danh mục
- `POST /api/danh-muc` - Tạo danh mục

### Thương Hiệu
- `GET /api/thuong-hieu` - Lấy tất cả thương hiệu
- `POST /api/thuong-hieu` - Tạo thương hiệu

### Người Dùng
- `GET /api/nguoi-dung` - Lấy tất cả người dùng
- `GET /api/nguoi-dung/{id}` - Lấy người dùng theo ID
- `POST /api/nguoi-dung/register` - Đăng ký tài khoản
- `POST /api/nguoi-dung/login` - Đăng nhập

### Đơn Hàng
- `GET /api/don-hang` - Lấy tất cả đơn hàng
- `POST /api/don-hang` - Tạo đơn hàng

### Giỏ Hàng
- `GET /api/gio-hang/{maNguoiDung}` - Lấy giỏ hàng theo người dùng

### Đánh Giá
- `GET /api/danh-gia` - Lấy tất cả đánh giá
- `POST /api/danh-gia` - Tạo đánh giá

## 🔒 CORS Configuration

CORS đã được cấu hình cho phép yêu cầu từ frontend tại:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Các phương thức được phép: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

## 📝 Biến Môi Trường

File `.env` chứa các biến cấu hình:

```env
DB_HOST=localhost        # Hostname của PostgreSQL
DB_PORT=5432             # Port của PostgreSQL
DB_NAME=webthoitrang     # Tên database
DB_USERNAME=postgres     # Username của PostgreSQL
DB_PASSWORD=123          # Password của PostgreSQL
SERVER_PORT=8080         # Port của Spring Boot server
```

## 🗄️ Database Schema

Dự án sử dụng các bảng sau:
- `VaiTro` - Vai trò người dùng
- `NguoiDung` - Thông tin người dùng
- `DanhMuc` - Danh mục sản phẩm
- `ThuongHieu` - Thương hiệu
- `SanPham` - Thông tin sản phẩm
- `GioHang` - Giỏ hàng
- `ChiTietGioHang` - Chi tiết giỏ hàng
- `MaGiamGia` - Mã giảm giá
- `DonHang` - Đơn hàng
- `ChiTietDonHang` - Chi tiết đơn hàng
- `ThongTinGiaoHang` - Thông tin giao hàng
- `LienHe` - Liên hệ
- `DanhGia` - Đánh giá sản phẩm

## 🛠️ Công nghệ Sử Dụng

- **Framework**: Spring Boot 3.5.14
- **Language**: Java 21
- **Build Tool**: Maven
- **Database**: PostgreSQL 16
- **ORM**: Spring Data JPA/Hibernate
- **Containerization**: Docker & Docker Compose

## 📚 Tham Khảo

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

## 👤 Tác Giả

E-commerce Clothing Platform

## 📄 License

MIT License
