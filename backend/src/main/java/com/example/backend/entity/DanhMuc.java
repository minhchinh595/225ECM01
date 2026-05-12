package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "danhmuc")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class DanhMuc {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_danh_muc")
    private Integer maDanhMuc;

    @Column(name = "ten_danh_muc", length = 100)
    private String tenDanhMuc;
}
