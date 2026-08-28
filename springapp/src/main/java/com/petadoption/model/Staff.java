package com.petadoption.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "staff")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String username;

    @NotBlank
    private String passwordHash;

    // ADMIN, MANAGER
    private String role = "ADMIN";

    @CreationTimestamp
    private LocalDateTime creationDate;

    private LocalDateTime lastLoginDate;
}
