package com.petadoption.model;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("status")
    private String requestStatus = "PENDING";

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    // Aliases for frontend compatibility
    @JsonGetter("createdAt")
    public LocalDateTime getCreatedAt() { return requestDate; }

    @JsonGetter("submissionDate")
    public LocalDateTime getSubmissionDate() { return requestDate; }

    @JsonGetter("petName")
    public String getPetName() { return pet != null ? pet.getName() : null; }

    @JsonGetter("petId")
    public Long getPetId() { return pet != null ? pet.getId() : null; }
}
