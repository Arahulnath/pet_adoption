package com.petadoption.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pets")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Species is required")
    private String species;

    private String breed;
    private Integer age;
    private String gender;
    private String description;

    @JsonAlias("primaryImageUrl")
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    // AVAILABLE, PENDING, ADOPTED
    private String adoptionStatus = "AVAILABLE";

    // FR13: Health & History (staff-only)
    private String vaccinationStatus;
    private String spayNeuterStatus;

    @JsonAlias("specialNeeds")
    private String specialMedicalNeeds;

    // FR14: view tracking
    @Column(columnDefinition = "bigint default 0")
    private Long viewCount = 0L;

    @PrePersist
    @PreUpdate
    void defaults() {
        if (viewCount == null) viewCount = 0L;
        if (adoptionStatus == null || adoptionStatus.isBlank()) adoptionStatus = "AVAILABLE";
        else adoptionStatus = adoptionStatus.toUpperCase();
    }

    @CreationTimestamp
    private LocalDateTime creationDate;

    @UpdateTimestamp
    private LocalDateTime lastUpdatedDate;
}
