package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "thongtingiaohang")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class ThongTinGiaoHang {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_giao_hang")
    private Integer maGiaoHang;

    @OneToOne
    @JoinColumn(name = "ma_don_hang", unique = true)
    private DonHang donHang;

    @Column(name = "ten_nguoi_nhan", length = 100)
    private String tenNguoiNhan;

    @Column(name = "so_dien_thoai", length = 20)
    private String soDienThoai;

    @Column(name = "dia_chi", length = 255)
    private String diaChi;
}
