package com.petadoption.repository;

import com.petadoption.model.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {
    List<AdoptionRequest> findByRequestStatus(String status);
    List<AdoptionRequest> findByPet_Id(Long petId);
    List<AdoptionRequest> findByApplicantEmail(String email);

    @Query("SELECT COUNT(r) FROM AdoptionRequest r WHERE r.requestStatus = 'APPROVED' AND r.requestDate >= :since")
    long countApprovedSince(@Param("since") LocalDateTime since);
}
