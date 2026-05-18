package com.example.backend.service;

import com.example.backend.dto.GioHangDTO;
import com.example.backend.dto.GioHangDTO.ChiTietGioHangDTO;
import com.example.backend.dto.GioHangRequest;
import com.example.backend.entity.ChiTietGioHang;
import com.example.backend.entity.ChiTietGioHang.ChiTietGioHangId;
import com.example.backend.entity.GioHang;
import com.example.backend.entity.NguoiDung;
import com.example.backend.entity.SanPham;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ChiTietGioHangRepository;
import com.example.backend.repository.GioHangRepository;
import com.example.backend.repository.NguoiDungRepository;
import com.example.backend.repository.SanPhamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class GioHangService {

    private final GioHangRepository gioHangRepository;
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final SanPhamRepository sanPhamRepository;

    public GioHangService(GioHangRepository gioHangRepository,
                          ChiTietGioHangRepository chiTietGioHangRepository,
                          NguoiDungRepository nguoiDungRepository,
                          SanPhamRepository sanPhamRepository) {
        this.gioHangRepository = gioHangRepository;
        this.chiTietGioHangRepository = chiTietGioHangRepository;
        this.nguoiDungRepository = nguoiDungRepository;
        this.sanPhamRepository = sanPhamRepository;
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