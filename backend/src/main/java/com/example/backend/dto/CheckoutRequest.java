package com.example.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutRequest {
    @NotEmpty(message = "Vui long chon san pham de dat hang")
    private List<Integer> maSanPham;

    private String phuongThucThanhToan = "COD";

    private String tenNguoiNhan;

    private String soDienThoai;

    private String diaChi;

    private Integer maGiamGia;

    private BigDecimal tienGiam = BigDecimal.ZERO;
}
