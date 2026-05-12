package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThuongHieuRequest {
    @NotBlank(message = "Ten thuong hieu khong duoc de trong")
    @Size(max = 100, message = "Ten thuong hieu toi da 100 ky tu")
    private String tenThuongHieu;

    @Size(max = 255, message = "Mo ta toi da 255 ky tu")
    private String moTa;
}
