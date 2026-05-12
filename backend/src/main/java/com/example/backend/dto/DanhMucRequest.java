package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DanhMucRequest {
    @NotBlank(message = "Ten danh muc khong duoc de trong")
    @Size(max = 100, message = "Ten danh muc toi da 100 ky tu")
    private String tenDanhMuc;
}
