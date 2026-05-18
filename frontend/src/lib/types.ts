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
  hinhAnh2?: string | null
  hinhAnh3?: string | null
  hinhAnh4?: string | null
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

export type GioHangItem = {
  maSanPham: number
  tenSanPham: string
  gia: number
  hinhAnh?: string | null
  mauSac?: string | null
  size?: string | null
  tenThuongHieu?: string | null
  soLuong: number
  thanhTien: number
}

export type GioHang = {
  maGioHang: number
  maNguoiDung: number
  chiTiet: GioHangItem[]
  tongTien: number
}

export type GioHangRequest = {
  maSanPham: number
  soLuong: number
}

export type ChiTietDonHang = {
  maChiTietDonHang: number
  maSanPham: number
  tenSanPham?: string | null
  hinhAnh?: string | null
  soLuong: number
  gia: number
  thanhTien: number
}

export type DonHang = {
  maDonHang: number
  nguoiDung?: NguoiDung | null
  maNguoiDung?: number | null
  tenDangNhap?: string | null
  email?: string | null
  soDienThoai?: string | null
  diaChi?: string | null
  ngayDat: string
  trangThai?: string | null
  phuongThucThanhToan?: string | null
  tongTien: number
  phiVanChuyen?: number | null
  maGiamGia?: number | null
  maCode?: string | null
  tienGiam?: number | null
  chiTiet: ChiTietDonHang[]
}
