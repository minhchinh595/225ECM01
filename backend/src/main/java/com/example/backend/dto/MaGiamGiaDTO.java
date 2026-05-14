package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MaGiamGiaDTO {
    private Integer maGiamGia;
    private String maCode;
    private String tenChuongTrinh;
    private String loaiGiam;
    private BigDecimal giaTriGiam;
    private BigDecimal giaTriDonHangToiThieu;
    private BigDecimal giamToiDa;
    private Integer soLuong;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private Boolean trangThai;
}
