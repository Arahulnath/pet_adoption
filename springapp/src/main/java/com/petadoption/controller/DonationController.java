package com.petadoption.controller;

import com.petadoption.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/donation")
public class DonationController {

    private final EmailService emailService;

    @Value("${donation.gateway-url}")
    private String gatewayUrl;

    public DonationController(EmailService emailService) {
        this.emailService = emailService;
    }

    // Returns the payment gateway URL for the frontend to redirect to
    @GetMapping("/redirect")
    public ResponseEntity<Map<String, String>> getGatewayUrl() {
        return ResponseEntity.ok(Map.of("url", gatewayUrl));
    }

    // Called by payment gateway webhook after successful payment
    // Body: { "email": "donor@example.com", "amount": "$50" }
    @PostMapping("/confirm")
    public ResponseEntity<String> confirm(@RequestBody Map<String, String> body) {
        emailService.sendDonationConfirmation(body.get("email"), body.get("amount"));
        return ResponseEntity.ok("Confirmation email sent.");
    }
}
