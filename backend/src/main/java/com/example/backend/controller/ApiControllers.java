package com.example.backend.controller;

import com.example.backend.dto.DanhMucDTO;
import com.example.backend.dto.DanhMucRequest;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.dto.MaGiamGiaDTO;
import com.example.backend.dto.MaGiamGiaRequest;
import com.example.backend.dto.NguoiDungDTO;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.ThuongHieuDTO;
import com.example.backend.dto.ThuongHieuRequest;
import com.example.backend.dto.UpdateProfileRequest;
import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.ChiTietDonHangDTO;
import com.example.backend.dto.CheckoutRequest;
import com.example.backend.dto.DonHangDTO;
import com.example.backend.dto.GioHangDTO;
import com.example.backend.dto.GioHangRequest;
import com.example.backend.dto.UpdateDonHangStatusRequest;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import com.example.backend.service.CatalogService;
import com.example.backend.service.GioHangService;
import com.example.backend.service.NguoiDungService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

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
    private final ChiTietDonHangRepository chiTietDonHangRepository;

    DonHangController(DonHangRepository donHangRepository, ChiTietDonHangRepository chiTietDonHangRepository) {
        this.donHangRepository = donHangRepository;
        this.chiTietDonHangRepository = chiTietDonHangRepository;
    }

    @GetMapping
    public ResponseEntity<List<DonHangDTO>> getAll() {
        return ResponseEntity.ok(donHangRepository.findAll().stream().map(this::toDto).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonHangDTO> getById(@PathVariable Integer id) {
        DonHang donHang = donHangRepository.findById(id)
                .orElseThrow(() -> new com.example.backend.exception.ResourceNotFoundException("Khong tim thay don hang"));
        return ResponseEntity.ok(toDto(donHang));
    }

    @GetMapping("/nguoi-dung/{maNguoiDung}")
    public ResponseEntity<List<DonHangDTO>> getByUser(@PathVariable Integer maNguoiDung) {
        return ResponseEntity.ok(donHangRepository
                .findByNguoiDung_MaNguoiDungOrderByNgayDatDesc(maNguoiDung)
                .stream()
                .map(this::toDto)
                .toList());
    }

    @PostMapping
    public ResponseEntity<DonHang> create(@RequestBody DonHang donHang) {
        return ResponseEntity.ok(donHangRepository.save(donHang));
    }

    @PutMapping("/{id}/trang-thai")
    @Transactional
    public ResponseEntity<Void> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateDonHangStatusRequest request) {
        int updated = donHangRepository.updateTrangThai(id, request.getTrangThai().trim());
        if (updated == 0) {
            throw new com.example.backend.exception.ResourceNotFoundException("Khong tim thay don hang");
        }
        return ResponseEntity.noContent().build();
    }

    private DonHangDTO toDto(DonHang donHang) {
        NguoiDung nguoiDung = donHang.getNguoiDung();
        MaGiamGia maGiamGia = donHang.getMaGiamGia();
        List<ChiTietDonHangDTO> chiTiet = chiTietDonHangRepository
                .findByDonHang_MaDonHang(donHang.getMaDonHang())
                .stream()
                .map(this::toChiTietDto)
                .toList();

        return new DonHangDTO(
                donHang.getMaDonHang(),
                nguoiDung != null ? nguoiDung.getMaNguoiDung() : null,
                nguoiDung != null ? nguoiDung.getTenDangNhap() : null,
                nguoiDung != null ? nguoiDung.getEmail() : null,
                nguoiDung != null ? nguoiDung.getSoDienThoai() : null,
                nguoiDung != null ? nguoiDung.getDiaChi() : null,
                donHang.getNgayDat(),
                donHang.getTrangThai(),
                donHang.getPhuongThucThanhToan(),
                donHang.getTongTien(),
                donHang.getPhiVanChuyen(),
                maGiamGia != null ? maGiamGia.getMaGiamGia() : null,
                maGiamGia != null ? maGiamGia.getMaCode() : null,
                donHang.getTienGiam(),
                chiTiet
        );
    }

    private ChiTietDonHangDTO toChiTietDto(ChiTietDonHang chiTiet) {
        SanPham sanPham = chiTiet.getSanPham();
        BigDecimal gia = chiTiet.getGia() != null ? chiTiet.getGia() : BigDecimal.ZERO;
        int soLuong = chiTiet.getSoLuong() != null ? chiTiet.getSoLuong() : 0;
        return new ChiTietDonHangDTO(
                chiTiet.getMaChiTietDonHang(),
                sanPham != null ? sanPham.getMaSanPham() : null,
                sanPham != null ? sanPham.getTenSanPham() : null,
                sanPham != null ? sanPham.getHinhAnh() : null,
                chiTiet.getSoLuong(),
                chiTiet.getGia(),
                gia.multiply(BigDecimal.valueOf(soLuong))
        );
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
    private final GioHangService gioHangService;

    GioHangController(GioHangService gioHangService) {
        this.gioHangService = gioHangService;
    }

    @GetMapping("/{maNguoiDung}")
    public ResponseEntity<GioHangDTO> getByUser(@PathVariable Integer maNguoiDung) {
        return ResponseEntity.ok(gioHangService.getCartByUser(maNguoiDung));
    }

    @PostMapping("/{maNguoiDung}/add")
    public ResponseEntity<GioHangDTO> add(@PathVariable Integer maNguoiDung,
                                           @Valid @RequestBody GioHangRequest request) {
        return ResponseEntity.ok(gioHangService.addToCart(maNguoiDung, request));
    }

    @PutMapping("/{maNguoiDung}/update")
    public ResponseEntity<GioHangDTO> update(@PathVariable Integer maNguoiDung,
                                              @Valid @RequestBody GioHangRequest request) {
        return ResponseEntity.ok(gioHangService.updateCartItem(maNguoiDung, request));
    }

    @DeleteMapping("/{maNguoiDung}/remove/{maSanPham}")
    public ResponseEntity<GioHangDTO> remove(@PathVariable Integer maNguoiDung,
                                              @PathVariable Integer maSanPham) {
        return ResponseEntity.ok(gioHangService.removeFromCart(maNguoiDung, maSanPham));
    }

    @DeleteMapping("/{maNguoiDung}/clear")
    public ResponseEntity<Void> clear(@PathVariable Integer maNguoiDung) {
        gioHangService.clearCart(maNguoiDung);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{maNguoiDung}/count")
    public ResponseEntity<Integer> count(@PathVariable Integer maNguoiDung) {
        return ResponseEntity.ok(gioHangService.getCartCount(maNguoiDung));
    }

    @PostMapping("/{maNguoiDung}/checkout")
    public ResponseEntity<DonHangDTO> checkout(@PathVariable Integer maNguoiDung,
                                               @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(gioHangService.checkout(maNguoiDung, request));
    }
}

@RestController
@RequestMapping("/api/ma-giam-gia")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
class MaGiamGiaController {
    private final MaGiamGiaRepository maGiamGiaRepository;

    MaGiamGiaController(MaGiamGiaRepository maGiamGiaRepository) {
        this.maGiamGiaRepository = maGiamGiaRepository;
    }

    @GetMapping
    public ResponseEntity<List<MaGiamGiaDTO>> getAll() {
        List<MaGiamGiaDTO> list = maGiamGiaRepository.findAll().stream().map(m -> new MaGiamGiaDTO(
                m.getMaGiamGia(), m.getMaCode(), m.getTenChuongTrinh(),
                m.getLoaiGiam(), m.getGiaTriGiam(), m.getGiaTriDonHangToiThieu(),
                m.getGiamToiDa(), m.getSoLuong(), m.getNgayBatDau(),
                m.getNgayKetThuc(), m.getTrangThai()
        )).toList();
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<MaGiamGiaDTO> create(@Valid @RequestBody MaGiamGiaRequest request) {
        MaGiamGia entity = new MaGiamGia();
        entity.setMaCode(request.getMaCode().toUpperCase().trim());
        entity.setTenChuongTrinh(request.getTenChuongTrinh());
        entity.setLoaiGiam(request.getLoaiGiam());
        entity.setGiaTriGiam(request.getGiaTriGiam());
        entity.setGiaTriDonHangToiThieu(request.getGiaTriDonHangToiThieu() != null ? request.getGiaTriDonHangToiThieu() : java.math.BigDecimal.ZERO);
        entity.setGiamToiDa(request.getGiamToiDa());
        entity.setSoLuong(request.getSoLuong() != null ? request.getSoLuong() : 0);
        entity.setNgayBatDau(request.getNgayBatDau());
        entity.setNgayKetThuc(request.getNgayKetThuc());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : true);
        MaGiamGia saved = maGiamGiaRepository.save(entity);
        return ResponseEntity.ok(new MaGiamGiaDTO(
                saved.getMaGiamGia(), saved.getMaCode(), saved.getTenChuongTrinh(),
                saved.getLoaiGiam(), saved.getGiaTriGiam(), saved.getGiaTriDonHangToiThieu(),
                saved.getGiamToiDa(), saved.getSoLuong(), saved.getNgayBatDau(),
                saved.getNgayKetThuc(), saved.getTrangThai()
        ));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<MaGiamGiaDTO> toggle(@PathVariable Integer id) {
        MaGiamGia entity = maGiamGiaRepository.findById(id)
                .orElseThrow(() -> new com.example.backend.exception.ResourceNotFoundException("Khong tim thay ma giam gia"));
        entity.setTrangThai(!Boolean.TRUE.equals(entity.getTrangThai()));
        MaGiamGia saved = maGiamGiaRepository.save(entity);
        return ResponseEntity.ok(new MaGiamGiaDTO(
                saved.getMaGiamGia(), saved.getMaCode(), saved.getTenChuongTrinh(),
                saved.getLoaiGiam(), saved.getGiaTriGiam(), saved.getGiaTriDonHangToiThieu(),
                saved.getGiamToiDa(), saved.getSoLuong(), saved.getNgayBatDau(),
                saved.getNgayKetThuc(), saved.getTrangThai()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        maGiamGiaRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
