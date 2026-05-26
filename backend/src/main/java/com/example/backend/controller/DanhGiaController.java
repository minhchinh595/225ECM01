package com.example.backend.controller;

import com.example.backend.dto.DanhGiaDTO;
import com.example.backend.dto.DanhGiaRequest;
import com.example.backend.service.DanhGiaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/danh-gia")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DanhGiaController {

    private final DanhGiaService danhGiaService;

    public DanhGiaController(DanhGiaService danhGiaService) {
        this.danhGiaService = danhGiaService;
    }

    @GetMapping("/san-pham/{maSanPham}")
    public ResponseEntity<List<DanhGiaDTO>> getBySanPham(@PathVariable Integer maSanPham) {
        return ResponseEntity.ok(danhGiaService.getBySanPham(maSanPham));
    }

    @GetMapping("/nguoi-dung/{maNguoiDung}")
    public ResponseEntity<List<DanhGiaDTO>> getByNguoiDung(@PathVariable Integer maNguoiDung) {
        return ResponseEntity.ok(danhGiaService.getByNguoiDung(maNguoiDung));
    }

    @PostMapping("/{maNguoiDung}")
    public ResponseEntity<DanhGiaDTO> create(@PathVariable Integer maNguoiDung,
                                              @Valid @RequestBody DanhGiaRequest request) {
        return ResponseEntity.ok(danhGiaService.create(maNguoiDung, request));
    }

    @GetMapping("/san-pham/{maSanPham}/stats")
    public ResponseEntity<Map<String, Object>> getStats(@PathVariable Integer maSanPham) {
        Double avg = danhGiaService.getAverageSao(maSanPham);
        Integer count = danhGiaService.getCount(maSanPham);
        return ResponseEntity.ok(Map.of("average", avg, "total", count));
    }
}