package com.localservicefinder.controller;

import com.localservicefinder.dto.ChangeEmailRequest;
import com.localservicefinder.dto.ChangePasswordRequest;
import com.localservicefinder.model.User;
import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.service.CloudinaryImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryImageService cloudinaryImageService;

    public UserController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          CloudinaryImageService cloudinaryImageService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cloudinaryImageService = cloudinaryImageService;
    }

    @GetMapping("/profile")
    public Map<String, Object> getProfile(Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return buildProfileResponse(user);
    }

    @PutMapping(value = "/profile", consumes = "multipart/form-data")
    public Map<String, Object> updateProfile(
            Authentication authentication,
            @RequestParam String fullName,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile profileImage
    ) throws IOException {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(fullName);
        user.setPhone(phone != null ? phone : "");
        user.setBio(bio != null ? bio : "");

        if (profileImage != null && !profileImage.isEmpty()) {
            user.setProfileImage(cloudinaryImageService.uploadProfileImage(profileImage));
        }

        User savedUser = userRepository.save(user);
        return buildProfileResponse(savedUser);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request
    ) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Old password incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }

    @PutMapping("/change-email")
    public String changeEmail(
            Authentication authentication,
            @RequestBody ChangeEmailRequest request
    ) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(request.getNewEmail());

        userRepository.save(user);

        return "Email updated successfully";
    }

    @DeleteMapping("/delete-account")
    public String deleteAccount(Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

        return "Account deleted successfully";
    }

    private Map<String, Object> buildProfileResponse(User user) {
        Map<String, Object> response = new LinkedHashMap<>();

        response.put("id", user.getId());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("phone", user.getPhone());
        response.put("bio", user.getBio());
        response.put("profileImage", sanitizeProfileImage(user.getProfileImage()));
        response.put("active", user.isActive());

        return response;
    }

    private String sanitizeProfileImage(String profileImage) {
        if (profileImage == null || profileImage.isBlank()) {
            return null;
        }

        String trimmed = profileImage.trim();
        if (trimmed.startsWith("/uploads/")) {
            return null;
        }

        if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
            return trimmed;
        }

        return null;
    }
}
