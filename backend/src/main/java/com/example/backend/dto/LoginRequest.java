package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Ten dang nhap khong duoc de trong")
    private String tenDangNhap;

    @NotBlank(message = "Mat khau khong duoc de trong")
    private String matKhau;
}
