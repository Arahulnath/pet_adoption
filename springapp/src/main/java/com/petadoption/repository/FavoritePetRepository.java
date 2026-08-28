package com.petadoption.repository;

import com.petadoption.model.FavoritePet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritePetRepository extends JpaRepository<FavoritePet, Long> {
    List<FavoritePet> findByUserId(Long userId);
    Optional<FavoritePet> findByUserIdAndPetId(Long userId, Long petId);
    void deleteByUserIdAndPetId(Long userId, Long petId);
}
