package com.example.backend.service;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.dto.NguoiDungDTO;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.NguoiDung;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.NguoiDungRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NguoiDungService {
    private final NguoiDungRepository nguoiDungRepository;

    public NguoiDungService(NguoiDungRepository nguoiDungRepository) {
        this.nguoiDungRepository = nguoiDungRepository;
    }

    public List<NguoiDungDTO> getAll() {
        return nguoiDungRepository.findAll().stream().map(this::toDTO).toList();
    }

    public NguoiDungDTO getById(Integer id) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay nguoi dung voi id " + id));
        return toDTO(nguoiDung);
    }

    public NguoiDungDTO register(RegisterRequest request) {
        if (nguoiDungRepository.existsByTenDangNhap(request.getTenDangNhap())) {
            throw new BadRequestException("Ten dang nhap da ton tai");
        }
        if (nguoiDungRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email da ton tai");
        }
        if (nguoiDungRepository.existsBySoDienThoai(request.getSoDienThoai())) {
            throw new BadRequestException("So dien thoai da ton tai");
        }

        NguoiDung nguoiDung = new NguoiDung();
        nguoiDung.setTenDangNhap(request.getTenDangNhap());
        nguoiDung.setMatKhau(request.getMatKhau());
        nguoiDung.setEmail(request.getEmail());
        nguoiDung.setSoDienThoai(request.getSoDienThoai());
        nguoiDung.setDiaChi(request.getDiaChi());
        nguoiDung.setTrangThai(true);

        return toDTO(nguoiDungRepository.save(nguoiDung));
    }

    public LoginResponse login(LoginRequest request) {
        NguoiDung nguoiDung = nguoiDungRepository.findByTenDangNhap(request.getTenDangNhap())
                .orElseThrow(() -> new BadRequestException("Ten dang nhap hoac mat khau khong dung"));

        if (!nguoiDung.getMatKhau().equals(request.getMatKhau())) {
            throw new BadRequestException("Ten dang nhap hoac mat khau khong dung");
        }

        return new LoginResponse("Dang nhap thanh cong", toDTO(nguoiDung));
    }

    public NguoiDungDTO toDTO(NguoiDung nguoiDung) {
        return new NguoiDungDTO(
                nguoiDung.getMaNguoiDung(),
                nguoiDung.getTenDangNhap(),
                nguoiDung.getEmail(),
                nguoiDung.getSoDienThoai(),
                nguoiDung.getDiaChi(),
                nguoiDung.getVaiTro() != null ? nguoiDung.getVaiTro().getMaVaiTro() : null,
                nguoiDung.getVaiTro() != null ? nguoiDung.getVaiTro().getTenVaiTro() : null,
                nguoiDung.getTrangThai()
        );
    }
}
