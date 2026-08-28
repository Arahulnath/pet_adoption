package com.petadoption.config;

import com.petadoption.model.Pet;
import com.petadoption.model.Staff;
import com.petadoption.repository.PetRepository;
import com.petadoption.repository.StaffRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(PetRepository petRepo, StaffRepository staffRepo, PasswordEncoder encoder) {
        return args -> {
            // Seed default staff account
            if (staffRepo.findByUsername("admin").isEmpty()) {
                Staff staff = new Staff();
                staff.setUsername("admin");
                staff.setPasswordHash(encoder.encode("Admin@1234"));
                staff.setRole("MANAGER");
                staffRepo.save(staff);
            }

            // Seed sample pets only if DB is empty
            if (petRepo.count() == 0) {
                petRepo.save(pet("Buddy", "Dog", "Labrador Mix", 3, "A friendly and energetic Labrador who loves fetch and cuddles.",
                        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600"));
                petRepo.save(pet("Luna", "Cat", "Domestic Shorthair", 2, "A calm and affectionate cat who loves sunny spots and gentle pets.",
                        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600"));
                petRepo.save(pet("Max", "Dog", "German Shepherd", 4, "Loyal and intelligent — great with families and older children.",
                        "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600"));
                petRepo.save(pet("Milo", "Cat", "Tabby", 1, "Playful kitten full of energy. Loves toys and exploring.",
                        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600"));
                petRepo.save(pet("Bella", "Dog", "Golden Retriever", 5, "Sweet and gentle senior dog looking for a quiet loving home.",
                        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600"));
                petRepo.save(pet("Coco", "Rabbit", "Holland Lop", 2, "Adorable lop-eared rabbit, litter trained and very social.",
                        "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600"));
            }
        };
    }

    private Pet pet(String name, String species, String breed, int age, String desc, String imageUrl) {
        Pet p = new Pet();
        p.setName(name);
        p.setSpecies(species);
        p.setBreed(breed);
        p.setAge(age);
        p.setDescription(desc);
        p.setImageUrl(imageUrl);
        p.setAdoptionStatus("AVAILABLE");
        return p;
    }
}
