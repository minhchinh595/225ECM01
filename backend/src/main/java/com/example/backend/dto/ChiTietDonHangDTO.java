package com.example.backend.dto;

import java.math.BigDecimal;

public record ChiTietDonHangDTO(
        Integer maChiTietDonHang,
        Integer maSanPham,
        String tenSanPham,
        String hinhAnh,
        Integer soLuong,
        BigDecimal gia,
        BigDecimal thanhTien
) {
}
