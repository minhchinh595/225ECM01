# Web Thời Trang - E-Commerce Platform

🛒 Ứng dụng thương mại điện tử bán quần áo được xây dựng với **Spring Boot** (Backend) và **Next.js** (Frontend).

## 📁 Cấu Trúc Dự Án

```
.
├── backend/                 # Spring Boot API
├── frontend/                # Next.js Frontend
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile.backend       # Backend container
├── Dockerfile.frontend      # Frontend container
├── docker-compose.sh        # Helper script
└── README.md
```

## 🚀 Cách Chạy Ứng Dụng

### 1. **Sử dụng Docker Compose (Recommended)**

#### Yêu cầu
- Docker & Docker Compose cài đặt

#### Bước 1: Clone hoặc mở project
```bash
cd /e/ThuongMaiDienTu/Project
```

#### Bước 2: Khởi động toàn bộ hệ thống
```bash
# Cách 1: Dùng script helper
chmod +x docker-compose.sh
./docker-compose.sh start

# Cách 2: Dùng Docker Compose trực tiếp
docker-compose up -d
```

#### Bước 3: Kiểm tra trạng thái
```bash
docker-compose ps
```

#### Bước 4: Xem logs
```bash
./docker-compose.sh logs
# hoặc
docker-compose logs -f backend   # Backend logs
docker-compose logs -f frontend  # Frontend logs
docker-compose logs -f db        # Database logs
```

#### Bước 5: Dừng ứng dụng
```bash
./docker-compose.sh down
# hoặc
docker-compose down
```

### 2. **Chạy Locally (Phát triển)**

#### Backend
```bash
cd backend
mvn spring-boot:run
# Backend chạy tại http://localhost:8080
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend chạy tại http://localhost:3000
```

#### Database (PostgreSQL)
```bash
# Tạo database
psql -U postgres -c "CREATE DATABASE webthoitrang;"
```

## 🌐 Truy Cập Ứng Dụng

Sau khi khởi động, truy cập:

| Dịch vụ | URL | Mô tả |
|---------|-----|-------|
| Frontend | http://localhost:3000 | Giao diện ứng dụng |
| Backend API | http://localhost:8080/api | REST API |
| Database | localhost:5432 | PostgreSQL |

## 🔌 API Endpoints

### Sản Phẩm
```
GET    /api/san-pham
GET    /api/san-pham/{id}
POST   /api/san-pham
PUT    /api/san-pham/{id}
DELETE /api/san-pham/{id}
```

### Danh Mục
```
GET    /api/danh-muc
POST   /api/danh-muc
```

### Thương Hiệu
```
GET    /api/thuong-hieu
POST   /api/thuong-hieu
```

### Người Dùng
```
GET    /api/nguoi-dung
GET    /api/nguoi-dung/{id}
POST   /api/nguoi-dung/register
POST   /api/nguoi-dung/login
```

### Đơn Hàng
```
GET    /api/don-hang
POST   /api/don-hang
```

### Giỏ Hàng
```
GET    /api/gio-hang/{maNguoiDung}
```

### Đánh Giá
```
GET    /api/danh-gia
POST   /api/danh-gia
```

## 📋 Database Schema

14 bảng chính:
- **VaiTro** - Vai trò (Admin, User, Guest)
- **NguoiDung** - Thông tin người dùng
- **DanhMuc** - Danh mục sản phẩm
- **ThuongHieu** - Thương hiệu
- **SanPham** - Sản phẩm
- **GioHang** - Giỏ hàng
- **ChiTietGioHang** - Chi tiết giỏ hàng
- **MaGiamGia** - Mã giảm giá
- **DonHang** - Đơn hàng
- **ChiTietDonHang** - Chi tiết đơn hàng
- **ThongTinGiaoHang** - Thông tin giao hàng
- **LienHe** - Liên hệ
- **DanhGia** - Đánh giá sản phẩm

## 🔧 Cấu Hình

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webthoitrang
DB_USERNAME=postgres
DB_PASSWORD=123
SERVER_PORT=8080
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🛠️ Công nghệ Sử Dụng

### Backend
- **Framework**: Spring Boot 3.5.14
- **Language**: Java 21
- **Build Tool**: Maven
- **Database**: PostgreSQL 16
- **ORM**: Spring Data JPA / Hibernate

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI Library**: Shadcn UI / Tailwind CSS
- **Package Manager**: npm / bun

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose

## 📚 Tài Liệu

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Next.js Docs](https://nextjs.org/docs)

## 🐛 Troubleshooting

### Port 3000/8080 đã được sử dụng
```bash
# Thay đổi port trong docker-compose.yml
# hoặc giết process đang sử dụng port
lsof -i :3000  # Tìm process
kill -9 <PID>  # Giết process
```

### Database connection error
```bash
# Kiểm tra database có chạy không
docker-compose logs db

# Khởi động lại database
docker-compose restart db
```

### Build Docker thất bại
```bash
# Xóa image cũ
docker-compose down -v

# Build lại
docker-compose build --no-cache
```

## 📝 Quy trình Phát Triển

1. **Tạo Branch**: `git checkout -b feature/your-feature`
2. **Code**: Viết code theo quy chuẩn
3. **Test**: Chạy tests trước khi commit
4. **Commit**: `git commit -m "feat: description"`
5. **Push**: `git push origin feature/your-feature`
6. **Pull Request**: Tạo PR cho review

## 📞 Liên Hệ & Hỗ Trợ

Nếu gặp vấn đề, vui lòng kiểm tra:
- Docker & Docker Compose version
- Port availability
- Database credentials
- Network connectivity

## 📄 License

MIT License

---

**Phát triển bởi**: Chinh Dev  
**Ngày tạo**: 2026-05-12  
**Phiên bản**: 1.0.0-beta
