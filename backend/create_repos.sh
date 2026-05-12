#!/bin/bash

REPO_DIR="/e/ThuongMaiDienTu/Project/backend/src/main/java/com/example/backend/repository"

repos=(
  "DanhMucRepository|DanhMuc"
  "ThuongHieuRepository|ThuongHieu"
  "SanPhamRepository|SanPham"
  "GioHangRepository|GioHang"
  "ChiTietGioHangRepository|ChiTietGioHang"
  "MaGiamGiaRepository|MaGiamGia"
  "DonHangRepository|DonHang"
  "ChiTietDonHangRepository|ChiTietDonHang"
  "ThongTinGiaoHangRepository|ThongTinGiaoHang"
  "LienHeRepository|LienHe"
  "DanhGiaRepository|DanhGia"
)

for repo in "${repos[@]}"; do
  IFS="|" read -r name entity <<< "$repo"
  cat > "$REPO_DIR/${name}.java" << REPOEOF
package com.example.backend.repository;

import com.example.backend.entity.$entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface $name extends JpaRepository<$entity, Integer> {
}
REPOEOF
done

echo "Done creating repositories"
