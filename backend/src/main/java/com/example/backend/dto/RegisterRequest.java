package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Ten dang nhap khong duoc de trong")
    @Size(min = 3, max = 50, message = "Ten dang nhap phai tu 3 den 50 ky tu")
    private String tenDangNhap;

    @NotBlank(message = "Mat khau khong duoc de trong")
    @Size(min = 6, max = 255, message = "Mat khau phai tu 6 den 255 ky tu")
    private String matKhau;

    @NotBlank(message = "Email khong duoc de trong")
    @Email(message = "Email khong hop le")
    private String email;

    @NotBlank(message = "So dien thoai khong duoc de trong")
    @Size(max = 20, message = "So dien thoai toi da 20 ky tu")
    private String soDienThoai;

    @Size(max = 255, message = "Dia chi toi da 255 ky tu")
    private String diaChi;
}
