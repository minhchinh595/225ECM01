package com.example.backend.service;

import com.example.backend.dto.DanhGiaDTO;
import com.example.backend.dto.DanhGiaRequest;
import com.example.backend.entity.DanhGia;
import com.example.backend.entity.NguoiDung;
import com.example.backend.entity.SanPham;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ChiTietDonHangRepository;
import com.example.backend.repository.DanhGiaRepository;
import com.example.backend.repository.NguoiDungRepository;
import com.example.backend.repository.SanPhamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DanhGiaService {

    private final DanhGiaRepository danhGiaRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final SanPhamRepository sanPhamRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;

    public DanhGiaService(DanhGiaRepository danhGiaRepository,
                          NguoiDungRepository nguoiDungRepository,
                          SanPhamRepository sanPhamRepository,
                          ChiTietDonHangRepository chiTietDonHangRepository) {
        this.danhGiaRepository = danhGiaRepository;
        this.nguoiDungRepository = nguoiDungRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.chiTietDonHangRepository = chiTietDonHangRepository;
    }

    public List<DanhGiaDTO> getBySanPham(Integer maSanPham) {
        return danhGiaRepository.findBySanPham_MaSanPham(maSanPham)
                .stream().map(this::toDTO).toList();
    }

    public List<DanhGiaDTO> getByNguoiDung(Integer maNguoiDung) {
        return danhGiaRepository.findByNguoiDung_MaNguoiDung(maNguoiDung)
                .stream().map(this::toDTO).toList();
    }

    @Transactional
    public DanhGiaDTO create(Integer maNguoiDung, DanhGiaRequest request) {
        if (danhGiaRepository.existsByNguoiDungAndSanPham(maNguoiDung, request.getMaSanPham())) {
            throw new BadRequestException("Ban da danh gia san pham nay roi");
        }

        if (!chiTietDonHangRepository.existsByNguoiDungAndSanPhamAndDaGiao(maNguoiDung, request.getMaSanPham())) {
            throw new BadRequestException("Ban can mua san pham va nhan hang thanh cong de co the danh gia");
        }

        NguoiDung nguoiDung = nguoiDungRepository.findById(maNguoiDung)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay nguoi dung"));
        SanPham sanPham = sanPhamRepository.findById(request.getMaSanPham())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san pham"));

        DanhGia danhGia = new DanhGia();
        danhGia.setNguoiDung(nguoiDung);
        danhGia.setSanPham(sanPham);
        danhGia.setSoSao(request.getSoSao());
        danhGia.setBinhLuan(request.getBinhLuan());
        danhGia.setTrangThai("Hiển thị");

        return toDTO(danhGiaRepository.save(danhGia));
    }

    public Double getAverageSao(Integer maSanPham) {
        return danhGiaRepository.averageSaoBySanPham(maSanPham);
    }

    public Integer getCount(Integer maSanPham) {
        return danhGiaRepository.countBySanPham(maSanPham);
    }

    private DanhGiaDTO toDTO(DanhGia dg) {
        return new DanhGiaDTO(
                dg.getMaDanhGia(),
                dg.getNguoiDung().getMaNguoiDung(),
                dg.getNguoiDung().getTenDangNhap(),
                dg.getSanPham().getMaSanPham(),
                dg.getSanPham().getTenSanPham(),
                dg.getSoSao(),
                dg.getBinhLuan(),
                dg.getNgayDanhGia(),
                dg.getTrangThai()
        );
    }
}