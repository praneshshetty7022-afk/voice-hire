package com.voicehire;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication
public class MinimalApplication {

    public static void main(String[] args) {
        SpringApplication.run(MinimalApplication.class, args);
        System.out.println("Udyoga Mitra Minimal Application started successfully!");
        System.out.println("Test endpoint: http://localhost:8080/api/test");
        System.out.println("Health check: http://localhost:8080/api/health");
    }
}
