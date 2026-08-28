package com.petadoption.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "pet_images")
public class PetImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String imageUrl;

    private Boolean isPrimary = false;
}
