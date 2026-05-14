package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MaGiamGiaRequest {
    @NotBlank(message = "Ma code khong duoc de trong")
    private String maCode;

    private String tenChuongTrinh;

    @NotBlank(message = "Loai giam khong duoc de trong")
    private String loaiGiam; // "PHAN_TRAM" hoac "SO_TIEN"

    @NotNull(message = "Gia tri giam khong duoc de trong")
    private BigDecimal giaTriGiam;

    private BigDecimal giaTriDonHangToiThieu = BigDecimal.ZERO;

    private BigDecimal giamToiDa;

    private Integer soLuong = 0;

    @NotNull(message = "Ngay bat dau khong duoc de trong")
    private LocalDateTime ngayBatDau;

    @NotNull(message = "Ngay ket thuc khong duoc de trong")
    private LocalDateTime ngayKetThuc;

    private Boolean trangThai = true;
}
