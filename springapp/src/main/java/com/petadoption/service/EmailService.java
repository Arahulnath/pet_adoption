package com.petadoption.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String CB_NAME = "emailService";

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendAdoptionConfirmation(String to, String petName) {
        send(to, "Adoption Request Received",
                "Thank you! Your adoption request for " + petName + " has been received and is under review.");
    }

    public void sendStatusUpdate(String to, String petName, String status) {
        send(to, "Adoption Request Status Update",
                "Your adoption request for " + petName + " has been updated to: " + status + ".");
    }

    public void sendDonationConfirmation(String to, String amount) {
        send(to, "Donation Confirmation",
                "Thank you for your generous donation of " + amount + " to our shelter!");
    }

    @CircuitBreaker(name = CB_NAME, fallbackMethod = "sendFallback")
    @Retry(name = CB_NAME)
    void send(String to, String subject, String text) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromAddress);
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(text);
        mailSender.send(msg);
        log.info("Email sent to {}", to);
    }

    // Fallback: circuit is open or all retries exhausted
    void sendFallback(String to, String subject, String text, Throwable t) {
        log.warn("Email circuit open — could not send '{}' to {}: {}", subject, to, t.getMessage());
    }
}
