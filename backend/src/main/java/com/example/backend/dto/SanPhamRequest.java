package com.example.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SanPhamRequest {
    @NotBlank(message = "Ten san pham khong duoc de trong")
    @Size(max = 100, message = "Ten san pham toi da 100 ky tu")
    private String tenSanPham;

    @NotNull(message = "Gia khong duoc de trong")
    @DecimalMin(value = "0.0", inclusive = false, message = "Gia phai lon hon 0")
    private BigDecimal gia;

    @NotNull(message = "So luong ton khong duoc de trong")
    private Integer soLuongTon;

    @Size(max = 50, message = "Size toi da 50 ky tu")
    private String size;

    @Size(max = 50, message = "Mau sac toi da 50 ky tu")
    private String mauSac;

    @Size(max = 255, message = "Hinh anh toi da 255 ky tu")
    private String hinhAnh;

    @Size(max = 255, message = "Mo ta toi da 255 ky tu")
    private String moTa;

    @NotNull(message = "Ma danh muc khong duoc de trong")
    private Integer maDanhMuc;

    @NotNull(message = "Ma thuong hieu khong duoc de trong")
    private Integer maThuongHieu;
}
