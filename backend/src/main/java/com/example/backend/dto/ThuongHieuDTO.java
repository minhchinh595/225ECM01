package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThuongHieuDTO {
    private Integer maThuongHieu;
    private String tenThuongHieu;
    private String moTa;
}
