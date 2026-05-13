package com.example.backend.controller;

import com.example.backend.dto.DanhMucDTO;
import com.example.backend.dto.DanhMucRequest;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.dto.NguoiDungDTO;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.ThuongHieuDTO;
import com.example.backend.dto.ThuongHieuRequest;
import com.example.backend.dto.UpdateProfileRequest;
import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import com.example.backend.service.CatalogService;
import com.example.backend.service.NguoiDungService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/danh-muc")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
class DanhMucController {
    private final CatalogService catalogService;

    DanhMucController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public ResponseEntity<List<DanhMucDTO>> getAll() {
        return ResponseEntity.ok(catalogService.getAllDanhMuc());
    }

    @PostMapping
    public ResponseEntity<DanhMucDTO> create(@Valid @RequestBody DanhMucRequest request) {
        return ResponseEntity.ok(catalogService.createDanhMuc(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DanhMucDTO> update(@PathVariable Integer id, @Valid @RequestBody DanhMucRequest request) {
        return ResponseEntity.ok(catalogService.updateDanhMuc(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        catalogService.deleteDanhMuc(id);
        return ResponseEntity.ok().build();
    }
}

@RestController
@RequestMapping("/api/thuong-hieu")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
class ThuongHieuController {
    private final CatalogService catalogService;

    ThuongHieuController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public ResponseEntity<List<ThuongHieuDTO>> getAll() {
        return ResponseEntity.ok(catalogService.getAllThuongHieu());
    }

    @PostMapping
    public ResponseEntity<ThuongHieuDTO> create(@Valid @RequestBody ThuongHieuRequest request) {
        return ResponseEntity.ok(catalogService.createThuongHieu(request));
    }
}

@RestController
@RequestMapping("/api/nguoi-dung")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
class NguoiDungController {
    private final NguoiDungService nguoiDungService;

    NguoiDungController(NguoiDungService nguoiDungService) {
        this.nguoiDungService = nguoiDungService;
    }

    @GetMapping
    public ResponseEntity<List<NguoiDungDTO>> getAll() {
        return ResponseEntity.ok(nguoiDungService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NguoiDungDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(nguoiDungService.getById(id));
    }

    @PostMapping("/register")
    public ResponseEntity<NguoiDungDTO> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(nguoiDungService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(nguoiDungService.login(request));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<NguoiDungDTO> updateProfile(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(nguoiDungService.updateProfile(id, request));
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Integer id,
            @Valid @RequestBody ChangePasswordRequest request) {
        nguoiDungService.changePassword(id, request);
        return ResponseEntity.ok().build();
    }
}

@RestController
@RequestMapping("/api/don-hang")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
class DonHangController {
    private final DonHangRepository donHangRepository;

    DonHangController(DonHangRepository donHangRepository) {
        this.donHangRepository = donHangRepository;
    }

    @GetMapping
    public ResponseEntity<List<DonHang>> getAll() {
        return ResponseEntity.ok(donHangRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<DonHang> create(@RequestBody DonHang donHang) {
        return ResponseEntity.ok(donHangRepository.save(donHang));
    }
}

@RestController
@RequestMapping("/api/danh-gia")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
class DanhGiaController {
    private final DanhGiaRepository danhGiaRepository;

    DanhGiaController(DanhGiaRepository danhGiaRepository) {
        this.danhGiaRepository = danhGiaRepository;
    }

    @GetMapping
    public ResponseEntity<List<DanhGia>> getAll() {
        return ResponseEntity.ok(danhGiaRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<DanhGia> create(@RequestBody DanhGia danhGia) {
        return ResponseEntity.ok(danhGiaRepository.save(danhGia));
    }
}

@RestController
@RequestMapping("/api/gio-hang")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
class GioHangController {
    private final GioHangRepository gioHangRepository;

    GioHangController(GioHangRepository gioHangRepository) {
        this.gioHangRepository = gioHangRepository;
    }

    @GetMapping("/{maNguoiDung}")
    public ResponseEntity<GioHang> getByUser(@PathVariable Integer maNguoiDung) {
        Optional<GioHang> gioHang = gioHangRepository.findByNguoiDung_MaNguoiDung(maNguoiDung);
        return gioHang.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
