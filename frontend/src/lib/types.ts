export type ApiErrorResponse = {
  timestamp: string
  status: number
  error: string
  message: string
  details?: Record<string, string>
}

export type DanhMuc = {
  maDanhMuc: number
  tenDanhMuc: string
}

export type ThuongHieu = {
  maThuongHieu: number
  tenThuongHieu: string
  moTa?: string | null
}

export type SanPham = {
  maSanPham: number
  tenSanPham: string
  gia: number
  soLuongTon: number
  size?: string | null
  mauSac?: string | null
  hinhAnh?: string | null
  moTa?: string | null
  maDanhMuc: number
  tenDanhMuc?: string | null
  maThuongHieu: number
  tenThuongHieu?: string | null
}

export type NguoiDung = {
  maNguoiDung: number
  tenDangNhap: string
  email: string
  soDienThoai: string
  diaChi?: string | null
  hoTen?: string | null
  maVaiTro?: number | null
  tenVaiTro?: string | null
  trangThai?: boolean | null
}

export type LoginRequest = {
  tenDangNhap: string
  matKhau: string
}

export type RegisterRequest = {
  tenDangNhap: string
  matKhau: string
  email: string
  soDienThoai: string
  diaChi?: string
  maVaiTro?: number
}

export type LoginResponse = {
  message: string
  user: NguoiDung
}
