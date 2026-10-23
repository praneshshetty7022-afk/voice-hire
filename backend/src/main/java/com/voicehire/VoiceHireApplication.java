package com.voicehire;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Disabled to prevent conflicting auto-configuration exclusions with SimpleApplication
// @SpringBootApplication
public class VoiceHireApplication {

    public static void main(String[] args) {
        SpringApplication.run(VoiceHireApplication.class, args);
        System.out.println("VoiceHire Application started successfully!");
        System.out.println("Test endpoint: http://localhost:8080/api/test");
        System.out.println("Health check: http://localhost:8080/api/health");
    }
}
