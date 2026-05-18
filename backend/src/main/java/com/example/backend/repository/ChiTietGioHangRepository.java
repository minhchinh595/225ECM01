package com.example.backend.repository;

import com.example.backend.entity.ChiTietGioHang;
import com.example.backend.entity.ChiTietGioHang.ChiTietGioHangId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChiTietGioHangRepository extends JpaRepository<ChiTietGioHang, ChiTietGioHangId> {
    List<ChiTietGioHang> findByGioHang_MaGioHang(Integer maGioHang);
    void deleteByGioHang_MaGioHang(Integer maGioHang);
}
