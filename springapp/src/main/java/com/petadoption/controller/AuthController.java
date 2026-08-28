package com.petadoption.controller;

import com.petadoption.model.User;
import com.petadoption.service.StaffService;
import com.petadoption.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StaffService staffService;
    private final UserService userService;

    public AuthController(StaffService staffService, UserService userService) {
        this.staffService = staffService;
        this.userService = userService;
    }

    @PostMapping("/staff/register")
    public ResponseEntity<?> registerStaff(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(staffService.register(
                body.get("username"), body.get("password"), body.get("role")));
    }

    @PostMapping("/staff/login")
    public ResponseEntity<Map<String, Object>> loginStaff(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(staffService.login(body.get("username"), body.get("password")));
    }

    @PostMapping("/user/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.register(body.get("email"), body.get("password"), body.get("name")));
    }

    @PostMapping("/user/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.login(body.get("email"), body.get("password")));
    }
}
