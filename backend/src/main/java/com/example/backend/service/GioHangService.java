package com.example.backend.service;

import com.example.backend.dto.GioHangDTO;
import com.example.backend.dto.GioHangDTO.ChiTietGioHangDTO;
import com.example.backend.dto.GioHangRequest;
import com.example.backend.dto.CheckoutRequest;
import com.example.backend.dto.ChiTietDonHangDTO;
import com.example.backend.dto.DonHangDTO;
import com.example.backend.entity.ChiTietGioHang;
import com.example.backend.entity.ChiTietGioHang.ChiTietGioHangId;
import com.example.backend.entity.ChiTietDonHang;
import com.example.backend.entity.DonHang;
import com.example.backend.entity.GioHang;
import com.example.backend.entity.MaGiamGia;
import com.example.backend.entity.NguoiDung;
import com.example.backend.entity.SanPham;
import com.example.backend.entity.ThongTinGiaoHang;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ChiTietGioHangRepository;
import com.example.backend.repository.ChiTietDonHangRepository;
import com.example.backend.repository.DonHangRepository;
import com.example.backend.repository.GioHangRepository;
import com.example.backend.repository.MaGiamGiaRepository;
import com.example.backend.repository.NguoiDungRepository;
import com.example.backend.repository.SanPhamRepository;
import com.example.backend.repository.ThongTinGiaoHangRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class GioHangService {

    private final GioHangRepository gioHangRepository;
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final SanPhamRepository sanPhamRepository;
    private final ThongTinGiaoHangRepository thongTinGiaoHangRepository;
    private final MaGiamGiaRepository maGiamGiaRepository;

    public GioHangService(GioHangRepository gioHangRepository,
                          ChiTietGioHangRepository chiTietGioHangRepository,
                          DonHangRepository donHangRepository,
                          ChiTietDonHangRepository chiTietDonHangRepository,
                          NguoiDungRepository nguoiDungRepository,
                          SanPhamRepository sanPhamRepository,
                          ThongTinGiaoHangRepository thongTinGiaoHangRepository,
                          MaGiamGiaRepository maGiamGiaRepository) {
        this.gioHangRepository = gioHangRepository;
        this.chiTietGioHangRepository = chiTietGioHangRepository;
        this.donHangRepository = donHangRepository;
        this.chiTietDonHangRepository = chiTietDonHangRepository;
        this.nguoiDungRepository = nguoiDungRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.thongTinGiaoHangRepository = thongTinGiaoHangRepository;
        this.maGiamGiaRepository = maGiamGiaRepository;
    }

    public GioHangDTO getCartByUser(Integer maNguoiDung) {
        GioHang gioHang = getOrCreateCart(maNguoiDung);
        return toDTO(gioHang);
    }

    @Transactional
    public GioHangDTO addToCart(Integer maNguoiDung, GioHangRequest request) {
        GioHang gioHang = getOrCreateCart(maNguoiDung);

        SanPham sanPham = sanPhamRepository.findById(request.getMaSanPham())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        ChiTietGioHangId id = new ChiTietGioHangId(gioHang.getMaGioHang(), sanPham.getMaSanPham());

        ChiTietGioHang chiTiet = chiTietGioHangRepository.findById(id).orElse(null);
        if (chiTiet != null) {
            chiTiet.setSoLuong(chiTiet.getSoLuong() + request.getSoLuong());
            chiTietGioHangRepository.save(chiTiet);
        } else {
            chiTiet = new ChiTietGioHang();
            chiTiet.setId(new ChiTietGioHang.ChiTietGioHangId(gioHang.getMaGioHang(), sanPham.getMaSanPham()));
            chiTiet.setGioHang(gioHang);
            chiTiet.setSanPham(sanPham);
            chiTiet.setSoLuong(request.getSoLuong());
            chiTietGioHangRepository.save(chiTiet);
        }

        chiTietGioHangRepository.flush();
        return toDTO(gioHang);
    }

    @Transactional
    public GioHangDTO updateCartItem(Integer maNguoiDung, GioHangRequest request) {
        GioHang gioHang = getOrCreateCart(maNguoiDung);

        ChiTietGioHangId id = new ChiTietGioHangId(gioHang.getMaGioHang(), request.getMaSanPham());
        ChiTietGioHang chiTiet = chiTietGioHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không có trong giỏ hàng"));

        boolean cartDeleted = false;
        if (request.getSoLuong() <= 0) {
            chiTietGioHangRepository.delete(chiTiet);
            chiTietGioHangRepository.flush();
            cartDeleted = deleteCartIfEmpty(gioHang);
        } else {
            chiTiet.setSoLuong(request.getSoLuong());
            chiTietGioHangRepository.save(chiTiet);
            chiTietGioHangRepository.flush();
        }

        if (cartDeleted) {
            GioHangDTO empty = new GioHangDTO();
            empty.setMaNguoiDung(maNguoiDung);
            empty.setChiTiet(new ArrayList<>());
            empty.setTongTien(BigDecimal.ZERO);
            return empty;
        }
        return toDTO(gioHang);
    }

    @Transactional
    public GioHangDTO removeFromCart(Integer maNguoiDung, Integer maSanPham) {
        GioHang gioHang = getOrCreateCart(maNguoiDung);

        ChiTietGioHangId id = new ChiTietGioHangId(gioHang.getMaGioHang(), maSanPham);
        chiTietGioHangRepository.findById(id).ifPresent(chiTiet -> {
            chiTietGioHangRepository.delete(chiTiet);
            chiTietGioHangRepository.flush();
        });

        boolean cartDeleted = deleteCartIfEmpty(gioHang);
        if (cartDeleted) {
            GioHangDTO empty = new GioHangDTO();
            empty.setMaNguoiDung(maNguoiDung);
            empty.setChiTiet(new ArrayList<>());
            empty.setTongTien(BigDecimal.ZERO);
            return empty;
        }
        chiTietGioHangRepository.flush();
        return toDTO(gioHang);
    }

    @Transactional
    public void clearCart(Integer maNguoiDung) {
        GioHang gioHang = gioHangRepository.findByNguoiDung_MaNguoiDung(maNguoiDung).orElse(null);
        if (gioHang == null) return;
        chiTietGioHangRepository.deleteByGioHang_MaGioHang(gioHang.getMaGioHang());
        chiTietGioHangRepository.flush();
        gioHangRepository.delete(gioHang);
        gioHangRepository.flush();
    }

    public Integer getCartCount(Integer maNguoiDung) {
        GioHang gioHang = getOrCreateCart(maNguoiDung);
        chiTietGioHangRepository.flush();
        List<ChiTietGioHang> items = chiTietGioHangRepository.findByGioHang_MaGioHang(gioHang.getMaGioHang());
        return items.stream()
                .mapToInt(ChiTietGioHang::getSoLuong)
                .sum();
    }

    @Transactional
    public DonHangDTO checkout(Integer maNguoiDung, CheckoutRequest request) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(maNguoiDung)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay nguoi dung"));
        GioHang gioHang = gioHangRepository.findByNguoiDung_MaNguoiDung(maNguoiDung)
                .orElseThrow(() -> new BadRequestException("Gio hang dang trong"));

        List<Integer> selectedIds = request.getMaSanPham().stream().distinct().toList();
        List<ChiTietGioHang> selectedItems = chiTietGioHangRepository
                .findByGioHang_MaGioHang(gioHang.getMaGioHang())
                .stream()
                .filter(item -> selectedIds.contains(item.getSanPham().getMaSanPham()))
                .toList();

        if (selectedItems.isEmpty()) {
            throw new BadRequestException("Vui long chon san pham hop le de dat hang");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (ChiTietGioHang item : selectedItems) {
            SanPham sanPham = item.getSanPham();
            int stock = sanPham.getSoLuongTon() != null ? sanPham.getSoLuongTon() : 0;
            if (stock < item.getSoLuong()) {
                throw new BadRequestException("San pham " + sanPham.getTenSanPham() + " khong du so luong ton");
            }
            subtotal = subtotal.add(sanPham.getGia().multiply(BigDecimal.valueOf(item.getSoLuong())));
        }

        MaGiamGia maGiamGia = null;
        if (request.getMaGiamGia() != null) {
            maGiamGia = maGiamGiaRepository.findById(request.getMaGiamGia())
                    .orElseThrow(() -> new BadRequestException("Ma giam gia khong hop le"));
        }
        BigDecimal tienGiam = request.getTienGiam() != null ? request.getTienGiam() : BigDecimal.ZERO;
        if (tienGiam.compareTo(BigDecimal.ZERO) < 0 || tienGiam.compareTo(subtotal) > 0) {
            throw new BadRequestException("Tien giam khong hop le");
        }

        DonHang donHang = new DonHang();
        donHang.setNguoiDung(nguoiDung);
        donHang.setTrangThai("Cho xac nhan");
        donHang.setPhuongThucThanhToan(
                request.getPhuongThucThanhToan() != null && !request.getPhuongThucThanhToan().isBlank()
                        ? request.getPhuongThucThanhToan().trim()
                        : "COD"
        );
        donHang.setPhiVanChuyen(BigDecimal.ZERO);
        donHang.setMaGiamGia(maGiamGia);
        donHang.setTienGiam(tienGiam);
        donHang.setTongTien(subtotal.subtract(tienGiam));
        DonHang savedOrder = donHangRepository.save(donHang);

        ThongTinGiaoHang giaoHang = new ThongTinGiaoHang();
        giaoHang.setDonHang(savedOrder);
        giaoHang.setTenNguoiNhan(firstNonBlank(request.getTenNguoiNhan(), nguoiDung.getTenDangNhap()));
        giaoHang.setSoDienThoai(firstNonBlank(request.getSoDienThoai(), nguoiDung.getSoDienThoai()));
        giaoHang.setDiaChi(firstNonBlank(request.getDiaChi(), nguoiDung.getDiaChi()));
        thongTinGiaoHangRepository.save(giaoHang);

        List<ChiTietDonHangDTO> chiTiet = new ArrayList<>();
        for (ChiTietGioHang item : selectedItems) {
            SanPham sanPham = item.getSanPham();
            sanPham.setSoLuongTon(sanPham.getSoLuongTon() - item.getSoLuong());
            sanPhamRepository.save(sanPham);

            ChiTietDonHang detail = new ChiTietDonHang();
            detail.setDonHang(savedOrder);
            detail.setSanPham(sanPham);
            detail.setSoLuong(item.getSoLuong());
            detail.setGia(sanPham.getGia());
            ChiTietDonHang savedDetail = chiTietDonHangRepository.save(detail);

            BigDecimal thanhTien = savedDetail.getGia().multiply(BigDecimal.valueOf(savedDetail.getSoLuong()));
            chiTiet.add(new ChiTietDonHangDTO(
                    savedDetail.getMaChiTietDonHang(),
                    sanPham.getMaSanPham(),
                    sanPham.getTenSanPham(),
                    sanPham.getHinhAnh(),
                    savedDetail.getSoLuong(),
                    savedDetail.getGia(),
                    thanhTien
            ));

            chiTietGioHangRepository.delete(item);
        }

        chiTietGioHangRepository.flush();
        deleteCartIfEmpty(gioHang);

        return new DonHangDTO(
                savedOrder.getMaDonHang(),
                nguoiDung.getMaNguoiDung(),
                nguoiDung.getTenDangNhap(),
                nguoiDung.getEmail(),
                nguoiDung.getSoDienThoai(),
                nguoiDung.getDiaChi(),
                savedOrder.getNgayDat(),
                savedOrder.getTrangThai(),
                savedOrder.getPhuongThucThanhToan(),
                savedOrder.getTongTien(),
                savedOrder.getPhiVanChuyen(),
                maGiamGia != null ? maGiamGia.getMaGiamGia() : null,
                maGiamGia != null ? maGiamGia.getMaCode() : null,
                savedOrder.getTienGiam(),
                chiTiet
        );
    }

    private String firstNonBlank(String value, String fallback) {
        return value != null && !value.isBlank() ? value.trim() : fallback;
    }

    private boolean deleteCartIfEmpty(GioHang gioHang) {
        chiTietGioHangRepository.flush();
        if (chiTietGioHangRepository.findByGioHang_MaGioHang(gioHang.getMaGioHang()).isEmpty()) {
            gioHangRepository.delete(gioHang);
            gioHangRepository.flush();
            return true;
        }
        return false;
    }

    private GioHang getOrCreateCart(Integer maNguoiDung) {
        return gioHangRepository.findByNguoiDung_MaNguoiDung(maNguoiDung)
                .orElseGet(() -> {
                    NguoiDung nguoiDung = nguoiDungRepository.findById(maNguoiDung)
                            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
                    GioHang newCart = new GioHang();
                    newCart.setNguoiDung(nguoiDung);
                    return gioHangRepository.save(newCart);
                });
    }

    private GioHangDTO toDTO(GioHang gioHang) {
        GioHangDTO dto = new GioHangDTO();
        dto.setMaGioHang(gioHang.getMaGioHang());
        dto.setMaNguoiDung(gioHang.getNguoiDung().getMaNguoiDung());

        List<ChiTietGioHang> chiTietList = chiTietGioHangRepository
                .findByGioHang_MaGioHang(gioHang.getMaGioHang());

        List<ChiTietGioHangDTO> chiTietDTOs = new ArrayList<>();
        BigDecimal tongTien = BigDecimal.ZERO;

        for (ChiTietGioHang ct : chiTietList) {
            SanPham sp = ct.getSanPham();
            BigDecimal thanhTien = sp.getGia().multiply(BigDecimal.valueOf(ct.getSoLuong()));
            tongTien = tongTien.add(thanhTien);

            ChiTietGioHangDTO ctDTO = new ChiTietGioHangDTO();
            ctDTO.setMaSanPham(sp.getMaSanPham());
            ctDTO.setTenSanPham(sp.getTenSanPham());
            ctDTO.setGia(sp.getGia());
            ctDTO.setHinhAnh(sp.getHinhAnh());
            ctDTO.setMauSac(sp.getMauSac());
            ctDTO.setSize(sp.getSize());
            ctDTO.setTenThuongHieu(sp.getThuongHieu() != null ? sp.getThuongHieu().getTenThuongHieu() : null);
            ctDTO.setSoLuong(ct.getSoLuong());
            ctDTO.setThanhTien(thanhTien);
            chiTietDTOs.add(ctDTO);
        }

        dto.setChiTiet(chiTietDTOs);
        dto.setTongTien(tongTien);
        return dto;
    }
}
