package com.petadoption.service;

import com.petadoption.exception.ResourceNotFoundException;
import com.petadoption.model.Pet;
import com.petadoption.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public Pet addPet(Pet pet) {
        return petRepository.save(pet);
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
    }

    public Pet updatePet(Long id, Pet updatedPet) {
        Pet existing = getPetById(id);
        existing.setName(updatedPet.getName());
        existing.setSpecies(updatedPet.getSpecies());
        existing.setBreed(updatedPet.getBreed());
        existing.setAge(updatedPet.getAge());
        existing.setGender(updatedPet.getGender());
        existing.setDescription(updatedPet.getDescription());
        existing.setImageUrl(updatedPet.getImageUrl());
        existing.setAdoptionStatus(updatedPet.getAdoptionStatus());
        return petRepository.save(existing);
    }

    public void deletePet(Long id) {
        getPetById(id);
        petRepository.deleteById(id);
    }

    public List<Pet> getPetsByStatus(String status) {
        return petRepository.findByAdoptionStatus(status.toUpperCase());
    }
}
