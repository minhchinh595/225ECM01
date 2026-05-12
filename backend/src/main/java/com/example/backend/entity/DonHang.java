package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "donhang")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class DonHang {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_hang")
    private Integer maDonHang;

    @ManyToOne
    @JoinColumn(name = "ma_nguoi_dung")
    private NguoiDung nguoiDung;

    @Column(name = "ngay_dat", columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime ngayDat = LocalDateTime.now();

    @Column(name = "trang_thai", length = 50)
    private String trangThai;

    @Column(name = "phuong_thuc_thanh_toan", length = 50)
    private String phuongThucThanhToan;

    @Column(name = "tong_tien")
    private BigDecimal tongTien;

    @Column(name = "phi_van_chuyen", columnDefinition = "numeric default 0")
    private BigDecimal phiVanChuyen = BigDecimal.ZERO;

    @ManyToOne
    @JoinColumn(name = "ma_giam_gia")
    private MaGiamGia maGiamGia;

    @Column(name = "tien_giam", columnDefinition = "numeric default 0")
    private BigDecimal tienGiam = BigDecimal.ZERO;
}
