package com.petadoption.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "shelter_info")
public class ShelterInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String operatingHours;
    private String contactEmail;
    private String contactPhone;
}
