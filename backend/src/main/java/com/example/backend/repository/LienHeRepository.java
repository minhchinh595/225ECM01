package com.example.backend.repository;

import com.example.backend.entity.LienHe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LienHeRepository extends JpaRepository<LienHe, Integer> {
}
