package com.petadoption.repository;

import com.petadoption.model.PetImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetImageRepository extends JpaRepository<PetImage, Long> {
    List<PetImage> findByPetId(Long petId);
    void deleteByPetId(Long petId);
}
