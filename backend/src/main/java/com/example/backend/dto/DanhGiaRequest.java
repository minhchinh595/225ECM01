package com.example.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DanhGiaRequest {
    @NotNull(message = "Ma san pham khong duoc de trong")
    private Integer maSanPham;

    @NotNull(message = "So sao khong duoc de trong")
    @Min(value = 1, message = "So sao phai tu 1 den 5")
    @Max(value = 5, message = "So sao phai tu 1 den 5")
    private Integer soSao;

    @Size(max = 500, message = "Binh luan toi da 500 ky tu")
    private String binhLuan;
}