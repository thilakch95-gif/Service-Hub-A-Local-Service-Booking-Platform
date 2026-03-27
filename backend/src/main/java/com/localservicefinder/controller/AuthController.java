package com.localservicefinder.controller;

import com.localservicefinder.dto.ApiResponse;
import com.localservicefinder.dto.AuthDtos;
import com.localservicefinder.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDtos.AuthResponse>> register(
            @Valid @RequestBody AuthDtos.RegisterRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Registered successfully",
                        authService.register(request)
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDtos.AuthResponse>> login(
            @Valid @RequestBody AuthDtos.LoginRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Logged in successfully",
                        authService.login(request)
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Object>> logout() {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Logout successful on client side by dropping token",
                        null
                )
        );
    }
}