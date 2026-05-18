package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateDonHangStatusRequest {
    @NotBlank(message = "Trang thai khong duoc de trong")
    private String trangThai;

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }
}
