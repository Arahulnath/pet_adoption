package com.petadoption.controller;

import com.petadoption.model.FavoritePet;
import com.petadoption.model.Pet;
import com.petadoption.service.FavoritePetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoritePetController {

    private final FavoritePetService favoritePetService;

    public FavoritePetController(FavoritePetService favoritePetService) {
        this.favoritePetService = favoritePetService;
    }

    @GetMapping
    public ResponseEntity<List<Pet>> getFavorites(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(favoritePetService.getFavoritePets(email));
    }

    @PostMapping("/{petId}")
    public ResponseEntity<FavoritePet> addFavorite(@AuthenticationPrincipal String email,
                                                    @PathVariable Long petId) {
        return ResponseEntity.ok(favoritePetService.addFavorite(email, petId));
    }

    @DeleteMapping("/{petId}")
    public ResponseEntity<String> removeFavorite(@AuthenticationPrincipal String email,
                                                  @PathVariable Long petId) {
        favoritePetService.removeFavorite(email, petId);
        return ResponseEntity.ok("Removed from favorites.");
    }
}
