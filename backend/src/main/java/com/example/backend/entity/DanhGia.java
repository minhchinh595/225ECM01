package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "danhgia")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class DanhGia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_danh_gia")
    private Integer maDanhGia;

    @ManyToOne
    @JoinColumn(name = "ma_nguoi_dung")
    private NguoiDung nguoiDung;

    @ManyToOne
    @JoinColumn(name = "ma_san_pham")
    private SanPham sanPham;

    @Column(name = "so_sao")
    private Integer soSao;

    @Column(name = "binh_luan", length = 500)
    private String binhLuan;

    @Column(name = "ngay_danh_gia", columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime ngayDanhGia = LocalDateTime.now();

    @Column(name = "trang_thai", length = 50, columnDefinition = "varchar(50) default 'Hiển thị'")
    private String trangThai = "Hiển thị";
}
