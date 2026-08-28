package com.petadoption.service;

import com.petadoption.exception.ResourceNotFoundException;
import com.petadoption.model.FavoritePet;
import com.petadoption.model.Pet;
import com.petadoption.model.User;
import com.petadoption.repository.FavoritePetRepository;
import com.petadoption.repository.PetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.petadoption.model.Pet;

@Service
public class FavoritePetService {

    private final FavoritePetRepository favoritePetRepository;
    private final PetRepository petRepository;
    private final UserService userService;

    public FavoritePetService(FavoritePetRepository favoritePetRepository,
                               PetRepository petRepository,
                               UserService userService) {
        this.favoritePetRepository = favoritePetRepository;
        this.petRepository = petRepository;
        this.userService = userService;
    }

    public FavoritePet addFavorite(String email, Long petId) {
        User user = userService.findByEmail(email);
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found: " + petId));
        if (favoritePetRepository.findByUserIdAndPetId(user.getId(), petId).isPresent()) {
            throw new IllegalStateException("Pet already in favorites");
        }
        FavoritePet fav = new FavoritePet();
        fav.setUser(user);
        fav.setPet(pet);
        return favoritePetRepository.save(fav);
    }

    public List<Pet> getFavoritePets(String email) {
        User user = userService.findByEmail(email);
        return favoritePetRepository.findByUserId(user.getId()).stream()
                .map(FavoritePet::getPet)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<FavoritePet> getFavorites(String email) {
        User user = userService.findByEmail(email);
        return favoritePetRepository.findByUserId(user.getId());
    }

    @Transactional
    public void removeFavorite(String email, Long petId) {
        User user = userService.findByEmail(email);
        favoritePetRepository.deleteByUserIdAndPetId(user.getId(), petId);
    }
}
