package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity @Table(name = "ChiTietGioHang")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class ChiTietGioHang {

    @EmbeddedId
    private ChiTietGioHangId id;

    @ManyToOne @MapsId("maGioHang")
    @JoinColumn(name = "ma_gio_hang")
    private GioHang gioHang;

    @ManyToOne @MapsId("maSanPham")
    @JoinColumn(name = "ma_san_pham")
    private SanPham sanPham;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Embeddable
    @Getter @Setter @AllArgsConstructor @NoArgsConstructor @EqualsAndHashCode
    public static class ChiTietGioHangId implements Serializable {
        @Column(name = "ma_gio_hang")
        private Integer maGioHang;

        @Column(name = "ma_san_pham")
        private Integer maSanPham;
    }
}
