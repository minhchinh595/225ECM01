package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DanhGiaDTO {
    private Integer maDanhGia;
    private Integer maNguoiDung;
    private String tenDangNhap;
    private Integer maSanPham;
    private String tenSanPham;
    private Integer soSao;
    private String binhLuan;
    private LocalDateTime ngayDanhGia;
    private String trangThai;
}