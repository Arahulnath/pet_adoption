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
    public ResponseEntity<Pet> addPet(@Valid @RequestBody Pet pet) {
        return new ResponseEntity<>(petService.addPet(pet), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets() {
        return ResponseEntity.ok(petService.getAllPets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getPetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Long id, @Valid @RequestBody Pet pet) {
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
}
