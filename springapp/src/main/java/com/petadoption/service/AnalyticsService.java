package com.petadoption.service;

import com.petadoption.model.Pet;
import com.petadoption.repository.AdoptionRequestRepository;
import com.petadoption.repository.PetRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final PetRepository petRepository;
    private final AdoptionRequestRepository adoptionRequestRepository;

    public AnalyticsService(PetRepository petRepository, AdoptionRequestRepository adoptionRequestRepository) {
        this.petRepository = petRepository;
        this.adoptionRequestRepository = adoptionRequestRepository;
    }

    @Cacheable(value = "analytics", key = "#months")
    public Map<String, Object> getDashboard(int months) {
        Map<String, Object> data = new HashMap<>();

        long totalPets = petRepository.count();
        long totalAvailable = petRepository.findByAdoptionStatus("AVAILABLE").size();
        long totalRequests = adoptionRequestRepository.count();
        long pendingRequests = adoptionRequestRepository.findAll().stream()
                .filter(r -> "PENDING".equals(r.getRequestStatus())).count();

        Map<String, Long> byStatus = adoptionRequestRepository.findAll().stream()
                .collect(Collectors.groupingBy(r -> r.getRequestStatus(), Collectors.counting()));

        List<Pet> mostViewed = petRepository.findAllByOrderByViewCountDesc(PageRequest.of(0, 5));

        long adoptionsSince = adoptionRequestRepository.countApprovedSince(
                LocalDateTime.now().minusMonths(months));

        data.put("totalPets", totalPets);
        data.put("availablePets", totalAvailable);
        data.put("totalRequests", totalRequests);
        data.put("pendingRequests", pendingRequests);
        data.put("requestsByStatus", byStatus);
        data.put("mostViewedPets", mostViewed.stream()
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", p.getId());
                    m.put("name", p.getName());
                    m.put("views", p.getViewCount() != null ? p.getViewCount() : 0L);
                    return m;
                })
                .collect(Collectors.toList()));
        data.put("adoptionsInLastMonths", adoptionsSince);
        data.put("periodMonths", months);
        return data;
    }
}
