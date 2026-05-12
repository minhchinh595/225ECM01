package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "LienHe")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class LienHe {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_lien_he")
    private Integer maLienHe;

    @ManyToOne
    @JoinColumn(name = "ma_nguoi_dung")
    private NguoiDung nguoiDung;

    @Column(name = "noi_dung", length = 255)
    private String noiDung;

    @Column(name = "phan_hoi", length = 255)
    private String phanHoi;

    @Column(name = "trang_thai", length = 50)
    private String trangThai;
}
