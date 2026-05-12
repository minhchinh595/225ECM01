package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "GioHang")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class GioHang {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_gio_hang")
    private Integer maGioHang;

    @OneToOne
    @JoinColumn(name = "ma_nguoi_dung", unique = true)
    private NguoiDung nguoiDung;
}
