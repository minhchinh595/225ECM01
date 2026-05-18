package com.example.backend.repository;

import com.example.backend.entity.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Integer> {
    List<DonHang> findByNguoiDung_MaNguoiDungOrderByNgayDatDesc(Integer maNguoiDung);

    @Modifying
    @Query("update DonHang d set d.trangThai = :trangThai where d.maDonHang = :maDonHang")
    int updateTrangThai(@Param("maDonHang") Integer maDonHang, @Param("trangThai") String trangThai);
}
