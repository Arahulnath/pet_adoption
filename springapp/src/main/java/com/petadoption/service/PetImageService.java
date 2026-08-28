package com.petadoption.service;

import com.petadoption.exception.ResourceNotFoundException;
import com.petadoption.model.Pet;
import com.petadoption.model.PetImage;
import com.petadoption.repository.PetImageRepository;
import com.petadoption.repository.PetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PetImageService {

    private final PetImageRepository petImageRepository;
    private final PetRepository petRepository;

    public PetImageService(PetImageRepository petImageRepository, PetRepository petRepository) {
        this.petImageRepository = petImageRepository;
        this.petRepository = petRepository;
    }

    public List<PetImage> getImages(Long petId) {
        return petImageRepository.findByPetId(petId);
    }

    public PetImage addImage(Long petId, String imageUrl, boolean isPrimary) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found: " + petId));
        if (isPrimary) {
            clearPrimary(petId);
        }
        PetImage image = new PetImage();
        image.setPet(pet);
        image.setImageUrl(imageUrl);
        image.setIsPrimary(isPrimary);
        return petImageRepository.save(image);
    }

    public PetImage setPrimary(Long petId, Long imageId) {
        clearPrimary(petId);
        PetImage image = petImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + imageId));
        image.setIsPrimary(true);
        return petImageRepository.save(image);
    }

    @Transactional
    public void deleteImage(Long imageId) {
        petImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + imageId));
        petImageRepository.deleteById(imageId);
    }

    private void clearPrimary(Long petId) {
        petImageRepository.findByPetId(petId).forEach(img -> {
            if (Boolean.TRUE.equals(img.getIsPrimary())) {
                img.setIsPrimary(false);
                petImageRepository.save(img);
            }
        });
    }
}
