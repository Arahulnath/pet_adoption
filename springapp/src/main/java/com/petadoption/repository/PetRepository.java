package com.petadoption.repository;

import com.petadoption.model.Pet;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByAdoptionStatus(String adoptionStatus);
    List<Pet> findByNameContainingIgnoreCaseOrSpeciesContainingIgnoreCase(String name, String species);

    @Query("SELECT p FROM Pet p ORDER BY COALESCE(p.viewCount, 0) DESC")
    List<Pet> findAllByOrderByViewCountDesc(Pageable pageable);
}
