package com.petadoption.service;

import com.petadoption.model.ShelterInfo;
import com.petadoption.repository.ShelterInfoRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class ShelterInfoService {

    private final ShelterInfoRepository shelterInfoRepository;

    public ShelterInfoService(ShelterInfoRepository shelterInfoRepository) {
        this.shelterInfoRepository = shelterInfoRepository;
    }

    @Cacheable(value = "shelter", key = "'info'")
    public ShelterInfo get() {
        return shelterInfoRepository.findAll().stream().findFirst()
                .orElse(new ShelterInfo());
    }

    @CacheEvict(value = "shelter", allEntries = true)
    public ShelterInfo save(ShelterInfo info) {
        ShelterInfo existing = shelterInfoRepository.findAll().stream().findFirst().orElse(null);
        if (existing != null) {
            info.setId(existing.getId());
        }
        return shelterInfoRepository.save(info);
    }
}
