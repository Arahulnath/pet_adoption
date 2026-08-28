package com.petadoption.controller;

import com.petadoption.model.PetImage;
import com.petadoption.service.PetImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pets/{petId}/images")
public class PetImageController {

    private final PetImageService petImageService;

    public PetImageController(PetImageService petImageService) {
        this.petImageService = petImageService;
    }

    @GetMapping
    public ResponseEntity<List<PetImage>> getImages(@PathVariable Long petId) {
        return ResponseEntity.ok(petImageService.getImages(petId));
    }

    // Body: { "imageUrl": "https://...", "isPrimary": true }
    @PostMapping
    public ResponseEntity<PetImage> addImage(@PathVariable Long petId,
                                              @RequestBody Map<String, Object> body) {
        String url = (String) body.get("imageUrl");
        boolean isPrimary = Boolean.TRUE.equals(body.get("isPrimary"));
        return ResponseEntity.ok(petImageService.addImage(petId, url, isPrimary));
    }

    @PutMapping("/{imageId}/primary")
    public ResponseEntity<PetImage> setPrimary(@PathVariable Long petId,
                                                @PathVariable Long imageId) {
        return ResponseEntity.ok(petImageService.setPrimary(petId, imageId));
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable Long petId,
                                               @PathVariable Long imageId) {
        petImageService.deleteImage(imageId);
        return ResponseEntity.ok("Image deleted.");
    }
}
