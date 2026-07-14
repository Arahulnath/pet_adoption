package com.petadoption.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "pets")
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
    private String imageUrl;

    // AVAILABLE, PENDING, ADOPTED
    private String adoptionStatus = "AVAILABLE";
}
