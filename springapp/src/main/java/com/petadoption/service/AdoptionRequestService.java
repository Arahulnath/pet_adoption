package com.petadoption.service;

import com.petadoption.exception.ResourceNotFoundException;
import com.petadoption.model.AdoptionRequest;
import com.petadoption.model.Pet;
import com.petadoption.repository.AdoptionRequestRepository;
import com.petadoption.repository.PetRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class AdoptionRequestService {

    private static final Set<String> VALID_STATUSES = Set.of("RECEIVED", "UNDER_REVIEW", "APPROVED", "REJECTED");

    private final AdoptionRequestRepository adoptionRequestRepository;
    private final PetRepository petRepository;
    private final EmailService emailService;

    public AdoptionRequestService(AdoptionRequestRepository adoptionRequestRepository,
                                   PetRepository petRepository,
                                   EmailService emailService) {
        this.adoptionRequestRepository = adoptionRequestRepository;
        this.petRepository = petRepository;
        this.emailService = emailService;
    }

    public AdoptionRequest createRequest(Long petId, AdoptionRequest request) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));

        if (!"AVAILABLE".equals(pet.getAdoptionStatus())) {
            throw new IllegalStateException("Pet is not available for adoption. Current status: " + pet.getAdoptionStatus());
        }

        pet.setAdoptionStatus("PENDING");
        petRepository.save(pet);

        request.setPet(pet);
        request.setRequestStatus("PENDING");
        request.setRequestDate(LocalDateTime.now());
        AdoptionRequest saved = adoptionRequestRepository.save(request);

        emailService.sendAdoptionConfirmation(request.getApplicantEmail(), pet.getName());
        return saved;
    }

    public List<AdoptionRequest> getMyRequests(String email) {
        return adoptionRequestRepository.findByApplicantEmail(email);
    }

    public List<AdoptionRequest> getAllRequests() {
        return adoptionRequestRepository.findAll();
    }

    public AdoptionRequest getRequestById(Long id) {
        return adoptionRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adoption request not found with id: " + id));
    }

    @CacheEvict(value = "pets", allEntries = true)
    public AdoptionRequest updateRequestStatus(Long id, String newStatus) {
        String status = newStatus.toUpperCase();
        if (!VALID_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Invalid status. Allowed: " + VALID_STATUSES);
        }

        AdoptionRequest request = getRequestById(id);
        request.setRequestStatus(status);
        Pet pet = request.getPet();

        if ("APPROVED".equals(status)) {
            pet.setAdoptionStatus("ADOPTED");
            petRepository.save(pet);
        } else if ("REJECTED".equals(status)) {
            boolean hasPending = adoptionRequestRepository.findByPet_Id(pet.getId()).stream()
                    .anyMatch(r -> !r.getId().equals(id) && "PENDING".equals(r.getRequestStatus()));
            if (!hasPending) {
                pet.setAdoptionStatus("AVAILABLE");
                petRepository.save(pet);
            }
        }

        AdoptionRequest saved = adoptionRequestRepository.save(request);
        emailService.sendStatusUpdate(request.getApplicantEmail(), pet.getName(), status);
        return saved;
    }

    public void deleteRequest(Long id) {
        getRequestById(id);
        adoptionRequestRepository.deleteById(id);
    }
}
