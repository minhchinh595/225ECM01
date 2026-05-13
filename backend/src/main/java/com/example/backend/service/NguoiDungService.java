package com.example.backend.service;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.dto.NguoiDungDTO;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UpdateProfileRequest;
import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.entity.NguoiDung;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.NguoiDungRepository;
import com.example.backend.repository.VaiTroRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NguoiDungService {
    private final NguoiDungRepository nguoiDungRepository;
    private final VaiTroRepository vaiTroRepository;

    public NguoiDungService(NguoiDungRepository nguoiDungRepository,
                            VaiTroRepository vaiTroRepository) {
        this.nguoiDungRepository = nguoiDungRepository;
        this.vaiTroRepository = vaiTroRepository;
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

        // Tự động gán vai trò Khách hàng (maVaiTro = 3)
        vaiTroRepository.findById(3).ifPresent(nguoiDung::setVaiTro);

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

    public NguoiDungDTO updateProfile(Integer id, UpdateProfileRequest request) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay nguoi dung voi id " + id));

        // Check email uniqueness (exclude self)
        if (!nguoiDung.getEmail().equals(request.getEmail())
                && nguoiDungRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email da duoc su dung boi tai khoan khac");
        }
        // Check phone uniqueness (exclude self)
        if (!nguoiDung.getSoDienThoai().equals(request.getSoDienThoai())
                && nguoiDungRepository.existsBySoDienThoai(request.getSoDienThoai())) {
            throw new BadRequestException("So dien thoai da duoc su dung boi tai khoan khac");
        }

        nguoiDung.setEmail(request.getEmail());
        nguoiDung.setSoDienThoai(request.getSoDienThoai());
        nguoiDung.setDiaChi(request.getDiaChi());

        return toDTO(nguoiDungRepository.save(nguoiDung));
    }

    public void changePassword(Integer id, ChangePasswordRequest request) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay nguoi dung voi id " + id));

        if (!nguoiDung.getMatKhau().equals(request.getMatKhauCu())) {
            throw new BadRequestException("Mat khau cu khong chinh xac");
        }

        nguoiDung.setMatKhau(request.getMatKhauMoi());
        nguoiDungRepository.save(nguoiDung);
    }
}
