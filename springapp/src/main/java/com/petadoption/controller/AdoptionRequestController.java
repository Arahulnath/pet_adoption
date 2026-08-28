package com.petadoption.controller;

import com.petadoption.model.AdoptionRequest;
import com.petadoption.service.AdoptionRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/adoption-requests")
public class AdoptionRequestController {

    private final AdoptionRequestService adoptionRequestService;

    public AdoptionRequestController(AdoptionRequestService adoptionRequestService) {
        this.adoptionRequestService = adoptionRequestService;
    }

    @PostMapping("/pet/{petId}")
    public ResponseEntity<AdoptionRequest> createRequest(
            @PathVariable Long petId,
            @Valid @RequestBody AdoptionRequest request) {
        return new ResponseEntity<>(adoptionRequestService.createRequest(petId, request), HttpStatus.CREATED);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<AdoptionRequest>> getMyRequests(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(adoptionRequestService.getMyRequests(email));
    }

    @GetMapping
    public ResponseEntity<List<AdoptionRequest>> getAllRequests() {
        return ResponseEntity.ok(adoptionRequestService.getAllRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdoptionRequest> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(adoptionRequestService.getRequestById(id));
    }

    // Request body: { "status": "APPROVED" }
    @PutMapping("/{id}/status")
    public ResponseEntity<AdoptionRequest> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(adoptionRequestService.updateRequestStatus(id, body.get("status")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRequest(@PathVariable Long id) {
        adoptionRequestService.deleteRequest(id);
        return ResponseEntity.ok("Adoption request deleted successfully.");
    }
}
