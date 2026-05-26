package com.example.backend.repository;

import com.example.backend.entity.DanhGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, Integer> {
    List<DanhGia> findBySanPham_MaSanPham(Integer maSanPham);

    List<DanhGia> findByNguoiDung_MaNguoiDung(Integer maNguoiDung);

    @Query("SELECT COUNT(d) > 0 FROM DanhGia d WHERE d.nguoiDung.maNguoiDung = :maNguoiDung AND d.sanPham.maSanPham = :maSanPham")
    boolean existsByNguoiDungAndSanPham(@Param("maNguoiDung") Integer maNguoiDung, @Param("maSanPham") Integer maSanPham);

    @Query("SELECT COALESCE(AVG(d.soSao), 0) FROM DanhGia d WHERE d.sanPham.maSanPham = :maSanPham")
    Double averageSaoBySanPham(@Param("maSanPham") Integer maSanPham);

    @Query("SELECT COUNT(d) FROM DanhGia d WHERE d.sanPham.maSanPham = :maSanPham")
    Integer countBySanPham(@Param("maSanPham") Integer maSanPham);
}