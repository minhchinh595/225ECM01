package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "magiamgia")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class MaGiamGia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_giam_gia")
    private Integer maGiamGia;

    @Column(name = "ma_code", length = 50, unique = true, nullable = false)
    private String maCode;

    @Column(name = "ten_chuong_trinh", length = 100)
    private String tenChuongTrinh;

    @Column(name = "loai_giam", length = 20, nullable = false)
    private String loaiGiam;

    @Column(name = "gia_tri_giam")
    private BigDecimal giaTriGiam;

    @Column(name = "gia_tri_don_hang_toi_thieu", columnDefinition = "numeric default 0")
    private BigDecimal giaTriDonHangToiThieu = BigDecimal.ZERO;

    @Column(name = "giam_toi_da")
    private BigDecimal giamToiDa;

    @Column(name = "so_luong", columnDefinition = "integer default 0")
    private Integer soLuong = 0;

    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDateTime ngayKetThuc;

    @Column(name = "trang_thai", columnDefinition = "boolean default true")
    private Boolean trangThai = true;
}
