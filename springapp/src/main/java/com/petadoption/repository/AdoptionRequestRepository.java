package com.petadoption.repository;

import com.petadoption.model.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {
}
