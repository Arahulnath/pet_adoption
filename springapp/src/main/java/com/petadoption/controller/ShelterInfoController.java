package com.petadoption.controller;

import com.petadoption.model.ShelterInfo;
import com.petadoption.service.ShelterInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shelter")
public class ShelterInfoController {

    private final ShelterInfoService shelterInfoService;

    public ShelterInfoController(ShelterInfoService shelterInfoService) {
        this.shelterInfoService = shelterInfoService;
    }

    @GetMapping
    public ResponseEntity<ShelterInfo> get() {
        return ResponseEntity.ok(shelterInfoService.get());
    }

    @PutMapping
    public ResponseEntity<ShelterInfo> update(@RequestBody ShelterInfo info) {
        return ResponseEntity.ok(shelterInfoService.save(info));
    }
}
