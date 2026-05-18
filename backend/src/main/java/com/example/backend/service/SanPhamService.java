package com.example.backend.service;

import com.example.backend.dto.SanPhamDTO;
import com.example.backend.dto.SanPhamRequest;
import com.example.backend.entity.DanhMuc;
import com.example.backend.entity.SanPham;
import com.example.backend.entity.ThuongHieu;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.DanhMucRepository;
import com.example.backend.repository.SanPhamRepository;
import com.example.backend.repository.ThuongHieuRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SanPhamService {
    private final SanPhamRepository sanPhamRepository;
    private final DanhMucRepository danhMucRepository;
    private final ThuongHieuRepository thuongHieuRepository;

    public SanPhamService(
            SanPhamRepository sanPhamRepository,
            DanhMucRepository danhMucRepository,
            ThuongHieuRepository thuongHieuRepository
    ) {
        this.sanPhamRepository = sanPhamRepository;
        this.danhMucRepository = danhMucRepository;
        this.thuongHieuRepository = thuongHieuRepository;
    }

    public List<SanPhamDTO> getAll() {
        return sanPhamRepository.findAll().stream().map(this::toDTO).toList();
    }

    public SanPhamDTO getById(Integer id) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san pham voi id " + id));
        return toDTO(sanPham);
    }

    public SanPhamDTO create(SanPhamRequest request) {
        SanPham sanPham = new SanPham();
        applyRequest(sanPham, request);
        return toDTO(sanPhamRepository.save(sanPham));
    }

    public SanPhamDTO update(Integer id, SanPhamRequest request) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay san pham voi id " + id));
        applyRequest(sanPham, request);
        return toDTO(sanPhamRepository.save(sanPham));
    }

    public void delete(Integer id) {
        if (!sanPhamRepository.existsById(id)) {
            throw new ResourceNotFoundException("Khong tim thay san pham voi id " + id);
        }
        sanPhamRepository.deleteById(id);
    }

    private void applyRequest(SanPham sanPham, SanPhamRequest request) {
        DanhMuc danhMuc = danhMucRepository.findById(request.getMaDanhMuc())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay danh muc voi id " + request.getMaDanhMuc()));
        ThuongHieu thuongHieu = thuongHieuRepository.findById(request.getMaThuongHieu())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay thuong hieu voi id " + request.getMaThuongHieu()));

        sanPham.setTenSanPham(request.getTenSanPham());
        sanPham.setGia(request.getGia());
        sanPham.setSoLuongTon(request.getSoLuongTon());
        sanPham.setSize(request.getSize());
        sanPham.setMauSac(request.getMauSac());
        sanPham.setHinhAnh(request.getHinhAnh());
        sanPham.setHinhAnh2(request.getHinhAnh2());
        sanPham.setHinhAnh3(request.getHinhAnh3());
        sanPham.setHinhAnh4(request.getHinhAnh4());
        sanPham.setMoTa(request.getMoTa());
        sanPham.setDanhMuc(danhMuc);
        sanPham.setThuongHieu(thuongHieu);
    }

    private SanPhamDTO toDTO(SanPham sanPham) {
        return new SanPhamDTO(
                sanPham.getMaSanPham(),
                sanPham.getTenSanPham(),
                sanPham.getGia(),
                sanPham.getSoLuongTon(),
                sanPham.getSize(),
                sanPham.getMauSac(),
                sanPham.getHinhAnh(),
                sanPham.getHinhAnh2(),
                sanPham.getHinhAnh3(),
                sanPham.getHinhAnh4(),
                sanPham.getMoTa(),
                sanPham.getDanhMuc() != null ? sanPham.getDanhMuc().getMaDanhMuc() : null,
                sanPham.getDanhMuc() != null ? sanPham.getDanhMuc().getTenDanhMuc() : null,
                sanPham.getThuongHieu() != null ? sanPham.getThuongHieu().getMaThuongHieu() : null,
                sanPham.getThuongHieu() != null ? sanPham.getThuongHieu().getTenThuongHieu() : null
        );
    }
}
