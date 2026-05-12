package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "ThuongHieu")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class ThuongHieu {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_thuong_hieu")
    private Integer maThuongHieu;

    @Column(name = "ten_thuong_hieu", length = 100)
    private String tenThuongHieu;

    @Column(name = "mo_ta", length = 255)
    private String moTa;
}
