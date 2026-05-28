package com.example.backend.repository;

import com.example.backend.entity.ChiTietDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHang, Integer> {
    List<ChiTietDonHang> findByDonHang_MaDonHang(Integer maDonHang);

    @Query("SELECT COUNT(ct) > 0 FROM ChiTietDonHang ct " +
           "WHERE ct.sanPham.maSanPham = :maSanPham " +
           "AND ct.donHang.nguoiDung.maNguoiDung = :maNguoiDung " +
           "AND ct.donHang.trangThai = 'Da giao'")
    boolean existsByNguoiDungAndSanPhamAndDaGiao(@Param("maNguoiDung") Integer maNguoiDung,
                                                  @Param("maSanPham") Integer maSanPham);
}