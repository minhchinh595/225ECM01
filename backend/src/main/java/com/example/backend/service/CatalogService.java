package com.example.backend.service;

import com.example.backend.dto.DanhMucDTO;
import com.example.backend.dto.DanhMucRequest;
import com.example.backend.dto.ThuongHieuDTO;
import com.example.backend.dto.ThuongHieuRequest;
import com.example.backend.entity.DanhMuc;
import com.example.backend.entity.ThuongHieu;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.DanhMucRepository;
import com.example.backend.repository.ThuongHieuRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CatalogService {
    private final DanhMucRepository danhMucRepository;
    private final ThuongHieuRepository thuongHieuRepository;

    public CatalogService(DanhMucRepository danhMucRepository, ThuongHieuRepository thuongHieuRepository) {
        this.danhMucRepository = danhMucRepository;
        this.thuongHieuRepository = thuongHieuRepository;
    }

    public List<DanhMucDTO> getAllDanhMuc() {
        return danhMucRepository.findAll().stream().map(this::toDanhMucDTO).toList();
    }

    public DanhMucDTO createDanhMuc(DanhMucRequest request) {
        DanhMuc danhMuc = new DanhMuc();
        danhMuc.setTenDanhMuc(request.getTenDanhMuc());
        return toDanhMucDTO(danhMucRepository.save(danhMuc));
    }

    public DanhMucDTO updateDanhMuc(Integer id, DanhMucRequest request) {
        DanhMuc danhMuc = danhMucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay danh muc voi id " + id));
        danhMuc.setTenDanhMuc(request.getTenDanhMuc());
        return toDanhMucDTO(danhMucRepository.save(danhMuc));
    }

    public void deleteDanhMuc(Integer id) {
        if (!danhMucRepository.existsById(id)) {
            throw new ResourceNotFoundException("Khong tim thay danh muc voi id " + id);
        }
        danhMucRepository.deleteById(id);
    }

    public List<ThuongHieuDTO> getAllThuongHieu() {
        return thuongHieuRepository.findAll().stream().map(this::toThuongHieuDTO).toList();
    }

    public ThuongHieuDTO createThuongHieu(ThuongHieuRequest request) {
        ThuongHieu thuongHieu = new ThuongHieu();
        thuongHieu.setTenThuongHieu(request.getTenThuongHieu());
        thuongHieu.setMoTa(request.getMoTa());
        return toThuongHieuDTO(thuongHieuRepository.save(thuongHieu));
    }

    private DanhMucDTO toDanhMucDTO(DanhMuc danhMuc) {
        return new DanhMucDTO(danhMuc.getMaDanhMuc(), danhMuc.getTenDanhMuc());
    }

    private ThuongHieuDTO toThuongHieuDTO(ThuongHieu thuongHieu) {
        return new ThuongHieuDTO(
                thuongHieu.getMaThuongHieu(),
                thuongHieu.getTenThuongHieu(),
                thuongHieu.getMoTa()
        );
    }
}
