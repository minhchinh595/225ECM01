# API Contract Cho Frontend

Base URL mac dinh:

```text
http://localhost:8080/api
```

Moi error validation/backend se tra ve dang:

```json
{
  "timestamp": "2026-05-12T13:50:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Du lieu gui len khong hop le",
  "details": {
    "email": "Email khong hop le"
  }
}
```

## 1. Dang nhap

`POST /nguoi-dung/login`

Request:

```json
{
  "tenDangNhap": "admin01",
  "matKhau": "123456"
}
```

Response:

```json
{
  "message": "Dang nhap thanh cong",
  "user": {
    "maNguoiDung": 1,
    "tenDangNhap": "admin01",
    "email": "admin@example.com",
    "soDienThoai": "0901234567",
    "diaChi": "Ha Noi",
    "maVaiTro": 1,
    "tenVaiTro": "Admin",
    "trangThai": true
  }
}
```

## 2. Dang ky

`POST /nguoi-dung/register`

Request:

```json
{
  "tenDangNhap": "newuser",
  "matKhau": "123456",
  "email": "newuser@example.com",
  "soDienThoai": "0900000000",
  "diaChi": "Da Nang"
}
```

Response:

```json
{
  "maNguoiDung": 2,
  "tenDangNhap": "newuser",
  "email": "newuser@example.com",
  "soDienThoai": "0900000000",
  "diaChi": "Da Nang",
  "maVaiTro": null,
  "tenVaiTro": null,
  "trangThai": true
}
```

## 3. Lay danh sach nguoi dung

`GET /nguoi-dung`

Response:

```json
[
  {
    "maNguoiDung": 1,
    "tenDangNhap": "admin01",
    "email": "admin@example.com",
    "soDienThoai": "0901234567",
    "diaChi": "Ha Noi",
    "maVaiTro": 1,
    "tenVaiTro": "Admin",
    "trangThai": true
  }
]
```

## 4. Lay danh sach san pham

`GET /san-pham`

Response:

```json
[
  {
    "maSanPham": 1,
    "tenSanPham": "Ao khoac bomber",
    "gia": 590000,
    "soLuongTon": 12,
    "size": "L",
    "mauSac": "Den",
    "hinhAnh": "https://example.com/image.jpg",
    "moTa": "Chat lieu day dan",
    "maDanhMuc": 2,
    "tenDanhMuc": "Ao khoac",
    "maThuongHieu": 3,
    "tenThuongHieu": "Urban Edge"
  }
]
```

## 5. Lay chi tiet san pham

`GET /san-pham/{id}`

Response co cung cau truc voi item cua `GET /san-pham`.

## 6. Tao san pham

`POST /san-pham`

Request:

```json
{
  "tenSanPham": "Quan jeans xanh",
  "gia": 420000,
  "soLuongTon": 18,
  "size": "M",
  "mauSac": "Xanh",
  "hinhAnh": "https://example.com/jeans.jpg",
  "moTa": "Form slim fit",
  "maDanhMuc": 1,
  "maThuongHieu": 2
}
```

Response:

```json
{
  "maSanPham": 5,
  "tenSanPham": "Quan jeans xanh",
  "gia": 420000,
  "soLuongTon": 18,
  "size": "M",
  "mauSac": "Xanh",
  "hinhAnh": "https://example.com/jeans.jpg",
  "moTa": "Form slim fit",
  "maDanhMuc": 1,
  "tenDanhMuc": "Quan",
  "maThuongHieu": 2,
  "tenThuongHieu": "Minimal Studio"
}
```

## 7. Cap nhat san pham

`PUT /san-pham/{id}`

Request body giong `POST /san-pham`.

## 8. Xoa san pham

`DELETE /san-pham/{id}`

Response:

```text
200 OK
```

## 9. Lay danh muc

`GET /danh-muc`

Response:

```json
[
  {
    "maDanhMuc": 1,
    "tenDanhMuc": "Ao"
  }
]
```

## 10. Tao danh muc

`POST /danh-muc`

Request:

```json
{
  "tenDanhMuc": "Quan"
}
```

## 11. Cap nhat danh muc

`PUT /danh-muc/{id}`

Request:

```json
{
  "tenDanhMuc": "Phu kien"
}
```

## 12. Xoa danh muc

`DELETE /danh-muc/{id}`

## 13. Lay thuong hieu

`GET /thuong-hieu`

Response:

```json
[
  {
    "maThuongHieu": 1,
    "tenThuongHieu": "Urban Edge",
    "moTa": "Streetwear"
  }
]
```

## 14. Tao thuong hieu

`POST /thuong-hieu`

Request:

```json
{
  "tenThuongHieu": "Minimal Studio",
  "moTa": "Basic wear"
}
```

## 15. Gio hang theo nguoi dung

`GET /gio-hang/{maNguoiDung}`

Response hien tai la entity raw:

```json
{
  "maGioHang": 1,
  "nguoiDung": {
    "maNguoiDung": 1
  }
}
```

## Ghi chu cho frontend

- `login` va `register` da dung JSON body, khong con dung `requestParam`.
- `san-pham`, `danh-muc`, `thuong-hieu`, `nguoi-dung` da co DTO ro rang de frontend map truc tiep.
- `don-hang`, `danh-gia`, `gio-hang` hien van la API co ban va chua duoc chuan hoa DTO day du o vong nay.
