package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GioHangDTO {
    private Integer maGioHang;
    private Integer maNguoiDung;
    private java.util.List<ChiTietGioHangDTO> chiTiet;
    private BigDecimal tongTien;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChiTietGioHangDTO {
        private Integer maSanPham;
        private String tenSanPham;
        private BigDecimal gia;
        private String hinhAnh;
        private String mauSac;
        private String size;
        private String tenThuongHieu;
        private Integer soLuong;
        private BigDecimal thanhTien;
    }
}