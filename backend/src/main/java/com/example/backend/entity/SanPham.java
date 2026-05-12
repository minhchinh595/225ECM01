package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "sanpham")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class SanPham {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_san_pham")
    private Integer maSanPham;

    @Column(name = "ten_san_pham", length = 100)
    private String tenSanPham;

    @Column(name = "gia")
    private BigDecimal gia;

    @Column(name = "so_luong_ton")
    private Integer soLuongTon;

    @Column(name = "size", length = 50)
    private String size;

    @Column(name = "mau_sac", length = 50)
    private String mauSac;

    @Column(name = "hinh_anh", length = 255)
    private String hinhAnh;

    @Column(name = "mo_ta", length = 255)
    private String moTa;

    @ManyToOne
    @JoinColumn(name = "ma_danh_muc")
    private DanhMuc danhMuc;

    @ManyToOne
    @JoinColumn(name = "ma_thuong_hieu")
    private ThuongHieu thuongHieu;
}
