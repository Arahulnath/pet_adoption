package com.petadoption.service;

import com.petadoption.exception.ResourceNotFoundException;
import com.petadoption.model.AdoptionRequest;
import com.petadoption.model.Pet;
import com.petadoption.repository.AdoptionRequestRepository;
import com.petadoption.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdoptionRequestService {

    private final AdoptionRequestRepository adoptionRequestRepository;
    private final PetRepository petRepository;

    public AdoptionRequestService(AdoptionRequestRepository adoptionRequestRepository,
                                   PetRepository petRepository) {
        this.adoptionRequestRepository = adoptionRequestRepository;
        this.petRepository = petRepository;
    }

    public AdoptionRequest createRequest(Long petId, AdoptionRequest request) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));

        if ("ADOPTED".equals(pet.getAdoptionStatus())) {
            throw new IllegalStateException("This pet has already been adopted.");
        }

        request.setPet(pet);
        request.setRequestStatus("PENDING");
        request.setRequestDate(LocalDateTime.now());
        return adoptionRequestRepository.save(request);
    }

    public List<AdoptionRequest> getAllRequests() {
        return adoptionRequestRepository.findAll();
    }

    public AdoptionRequest getRequestById(Long id) {
        return adoptionRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adoption request not found with id: " + id));
    }

    public AdoptionRequest updateRequestStatus(Long id, String newStatus) {
        AdoptionRequest request = getRequestById(id);
        request.setRequestStatus(newStatus.toUpperCase());

        // If approved, mark the pet as ADOPTED
        if ("APPROVED".equals(newStatus.toUpperCase())) {
            Pet pet = request.getPet();
            pet.setAdoptionStatus("ADOPTED");
            petRepository.save(pet);
        }

        return adoptionRequestRepository.save(request);
    }

    public void deleteRequest(Long id) {
        getRequestById(id);
        adoptionRequestRepository.deleteById(id);
    }
}
