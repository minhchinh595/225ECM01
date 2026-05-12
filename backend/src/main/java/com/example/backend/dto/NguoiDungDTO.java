package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NguoiDungDTO {
    private Integer maNguoiDung;
    private String tenDangNhap;
    private String email;
    private String soDienThoai;
    private String diaChi;
    private Integer maVaiTro;
    private String tenVaiTro;
    private Boolean trangThai;
}
