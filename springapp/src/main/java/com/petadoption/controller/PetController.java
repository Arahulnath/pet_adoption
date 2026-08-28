package com.petadoption.controller;

import com.petadoption.model.Pet;
import com.petadoption.service.PetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @PostMapping
    public ResponseEntity<Pet> addPet(@RequestBody Pet pet) {
        return new ResponseEntity<>(petService.addPet(pet), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String status) {
        List<Pet> pets = petService.getAllPets();
        if (status != null && !status.isBlank()) {
            String upperStatus = status.toUpperCase();
            pets = pets.stream()
                    .filter(p -> p.getAdoptionStatus() != null && upperStatus.equalsIgnoreCase(p.getAdoptionStatus()))
                    .collect(java.util.stream.Collectors.toList());
        }
        if (species != null && !species.isBlank()) {
            pets = pets.stream()
                    .filter(p -> p.getSpecies() != null && species.equalsIgnoreCase(p.getSpecies()))
                    .collect(java.util.stream.Collectors.toList());
        }
        if (search != null && !search.isBlank()) {
            String lower = search.toLowerCase();
            pets = pets.stream()
                    .filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(lower))
                            || (p.getBreed() != null && p.getBreed().toLowerCase().contains(lower))
                            || (p.getSpecies() != null && p.getSpecies().toLowerCase().contains(lower)))
                    .collect(java.util.stream.Collectors.toList());
        }
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getPetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Long id, @RequestBody Pet pet) {
        return ResponseEntity.ok(petService.updatePet(id, pet));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.ok("Pet deleted successfully.");
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Pet>> getPetsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(petService.getPetsByStatus(status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Pet>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(petService.searchPets(keyword));
    }
}
