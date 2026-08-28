package com.petadoption.service;

import com.petadoption.config.JwtUtil;
import com.petadoption.exception.ResourceNotFoundException;
import com.petadoption.model.Staff;
import com.petadoption.repository.StaffRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public StaffService(StaffRepository staffRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Staff register(String username, String password, String role) {
        if (staffRepository.findByUsername(username).isPresent()) {
            throw new IllegalStateException("Username already exists");
        }
        Staff staff = new Staff();
        staff.setUsername(username);
        staff.setPasswordHash(passwordEncoder.encode(password));
        staff.setRole(role != null ? role.toUpperCase() : "ADMIN");
        return staffRepository.save(staff);
    }

    public Map<String, Object> login(String username, String password) {
        Staff staff = staffRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found"));
        if (!passwordEncoder.matches(password, staff.getPasswordHash())) {
            throw new IllegalStateException("Invalid credentials");
        }
        staff.setLastLoginDate(LocalDateTime.now());
        staffRepository.save(staff);
        String token = jwtUtil.generateToken(username, staff.getRole());
        Map<String, Object> staffMap = new java.util.HashMap<>();
        staffMap.put("id", staff.getId());
        staffMap.put("username", staff.getUsername());
        staffMap.put("role", staff.getRole());
        return Map.of("token", token, "staff", staffMap);
    }
}
