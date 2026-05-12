package com.example.backend.repository;

import com.example.backend.entity.ThongTinGiaoHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ThongTinGiaoHangRepository extends JpaRepository<ThongTinGiaoHang, Integer> {
}
