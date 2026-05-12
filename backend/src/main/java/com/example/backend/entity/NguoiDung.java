package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "NguoiDung")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class NguoiDung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nguoi_dung")
    private Integer maNguoiDung;

    @Column(name = "ten_dang_nhap", length = 50, unique = true)
    private String tenDangNhap;

    @Column(name = "mat_khau", length = 255)
    private String matKhau;

    @Column(name = "email", length = 100, unique = true)
    private String email;

    @Column(name = "so_dien_thoai", length = 20, unique = true)
    private String soDienThoai;

    @Column(name = "dia_chi", length = 255)
    private String diaChi;

    @ManyToOne
    @JoinColumn(name = "ma_vai_tro")
    private VaiTro vaiTro;

    @Column(name = "trang_thai", columnDefinition = "boolean default true")
    private Boolean trangThai = true;
}
