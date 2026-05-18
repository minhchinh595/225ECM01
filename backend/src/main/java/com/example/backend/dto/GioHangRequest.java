package com.example.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GioHangRequest {
    @NotNull(message = "maSanPham không được để trống")
    private Integer maSanPham;

    @NotNull(message = "soLuong không được để trống")
    @Min(value = 1, message = "soLuong phải >= 1")
    private Integer soLuong;
}