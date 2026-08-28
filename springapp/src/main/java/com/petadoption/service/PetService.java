package com.petadoption.service;

import com.petadoption.exception.ResourceNotFoundException;
import com.petadoption.model.Pet;
import com.petadoption.repository.PetRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public Pet addPet(Pet pet) {
        if (pet.getName() == null || pet.getName().isBlank())
            throw new IllegalArgumentException("Pet name is required");
        if (pet.getSpecies() == null || pet.getSpecies().isBlank())
            throw new IllegalArgumentException("Species is required");
        return petRepository.save(pet);
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Pet getPetById(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
        pet.setViewCount(pet.getViewCount() + 1);
        return petRepository.save(pet);
    }

    public Pet updatePet(Long id, Pet updatedPet) {
        Pet existing = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
        existing.setName(updatedPet.getName());
        existing.setSpecies(updatedPet.getSpecies());
        existing.setBreed(updatedPet.getBreed());
        existing.setAge(updatedPet.getAge());
        existing.setGender(updatedPet.getGender());
        existing.setDescription(updatedPet.getDescription());
        existing.setImageUrl(updatedPet.getImageUrl());
        existing.setAdoptionStatus(updatedPet.getAdoptionStatus());
        existing.setVaccinationStatus(updatedPet.getVaccinationStatus());
        existing.setSpayNeuterStatus(updatedPet.getSpayNeuterStatus());
        existing.setSpecialMedicalNeeds(updatedPet.getSpecialMedicalNeeds());
        return petRepository.save(existing);
    }

    public void deletePet(Long id) {
        petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
        petRepository.deleteById(id);
    }

    public List<Pet> getPetsByStatus(String status) {
        return petRepository.findByAdoptionStatus(status.toUpperCase());
    }

    public List<Pet> searchPets(String keyword) {
        return petRepository.findByNameContainingIgnoreCaseOrSpeciesContainingIgnoreCase(keyword, keyword);
    }

    public List<Pet> getMostViewed(int limit) {
        return petRepository.findAllByOrderByViewCountDesc(PageRequest.of(0, limit));
    }
}
