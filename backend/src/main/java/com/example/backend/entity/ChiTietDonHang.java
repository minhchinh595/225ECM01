package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "ChiTietDonHang")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class ChiTietDonHang {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_chi_tiet_don_hang")
    private Integer maChiTietDonHang;

    @ManyToOne
    @JoinColumn(name = "ma_don_hang")
    private DonHang donHang;

    @ManyToOne
    @JoinColumn(name = "ma_san_pham")
    private SanPham sanPham;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "gia")
    private BigDecimal gia;
}
