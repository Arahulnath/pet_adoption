package com.petadoption.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

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

    private void send(String to, String subject, String text) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromAddress);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(text);
            mailSender.send(msg);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.warn("Email could not be sent to {}: {}", to, e.getMessage());
        }
    }
}
