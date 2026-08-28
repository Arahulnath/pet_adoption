package com.petadoption.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "favorite_pets", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "pet_id"})
})
public class FavoritePet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;
}
