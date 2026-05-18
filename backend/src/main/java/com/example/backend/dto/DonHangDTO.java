package com.example.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record DonHangDTO(
        Integer maDonHang,
        Integer maNguoiDung,
        String tenDangNhap,
        String email,
        String soDienThoai,
        String diaChi,
        LocalDateTime ngayDat,
        String trangThai,
        String phuongThucThanhToan,
        BigDecimal tongTien,
        BigDecimal phiVanChuyen,
        Integer maGiamGia,
        String maCode,
        BigDecimal tienGiam,
        List<ChiTietDonHangDTO> chiTiet
) {
}
