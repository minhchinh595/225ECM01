package com.example.backend.controller;

import com.example.backend.dto.SanPhamDTO;
import com.example.backend.dto.SanPhamRequest;
import com.example.backend.service.SanPhamService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/san-pham")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class SanPhamController {

    private final SanPhamService sanPhamService;

    public SanPhamController(SanPhamService sanPhamService) {
        this.sanPhamService = sanPhamService;
    }

    @GetMapping
    public ResponseEntity<List<SanPhamDTO>> getAll() {
        return ResponseEntity.ok(sanPhamService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SanPhamDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(sanPhamService.getById(id));
    }

    @PostMapping
    public ResponseEntity<SanPhamDTO> create(@Valid @RequestBody SanPhamRequest sanPhamRequest) {
        return ResponseEntity.ok(sanPhamService.create(sanPhamRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SanPhamDTO> update(@PathVariable Integer id, @Valid @RequestBody SanPhamRequest sanPhamRequest) {
        return ResponseEntity.ok(sanPhamService.update(id, sanPhamRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sanPhamService.delete(id);
        return ResponseEntity.ok().build();
    }
}
