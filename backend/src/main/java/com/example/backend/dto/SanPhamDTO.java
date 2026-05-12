package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SanPhamDTO {
    private Integer maSanPham;
    private String tenSanPham;
    private BigDecimal gia;
    private Integer soLuongTon;
    private String size;
    private String mauSac;
    private String hinhAnh;
    private String moTa;
    private Integer maDanhMuc;
    private String tenDanhMuc;
    private Integer maThuongHieu;
    private String tenThuongHieu;
}
