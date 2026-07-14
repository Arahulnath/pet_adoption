package com.petadoption.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "adoption_requests")
public class AdoptionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String applicantEmail;

    @NotBlank(message = "Phone is required")
    private String applicantPhone;

    private String address;
    private String message;

    private LocalDateTime requestDate;

    // PENDING, APPROVED, REJECTED
    private String requestStatus = "PENDING";

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;
}
