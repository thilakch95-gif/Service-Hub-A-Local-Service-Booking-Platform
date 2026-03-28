package com.localservicefinder.controller;

import com.localservicefinder.dto.ChangeEmailRequest;
import com.localservicefinder.dto.ChangePasswordRequest;
import com.localservicefinder.model.User;
import com.localservicefinder.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Path uploadPath;
    private final String baseUrl;

    public UserController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          @Value("${app.upload-dir}") String uploadDir,
                          @Value("${app.public-base-url:}") String baseUrl) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.baseUrl = normalizeBaseUrl(baseUrl);
        System.out.println("BASE URL: " + this.baseUrl);
    }

    @GetMapping("/profile")
    public User getProfile(Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfileImage(toPublicImageUrl(user.getProfileImage()));
        return user;
    }

    @PutMapping(value = "/profile", consumes = "multipart/form-data")
    public User updateProfile(
            Authentication authentication,
            HttpServletRequest request,
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
            Files.createDirectories(uploadPath);

            String originalFileName = StringUtils.cleanPath(profileImage.getOriginalFilename());
            String safeFileName = originalFileName.replace(" ", "_");
            String fileName = System.currentTimeMillis() + "_" + safeFileName;

            Path file = uploadPath.resolve(fileName);
            profileImage.transferTo(file);

            String resolvedBaseUrl = resolveBaseUrl(request);
            String imageUrl = resolvedBaseUrl + "/uploads/" + fileName;
            System.out.println("BASE URL: " + resolvedBaseUrl);
            System.out.println("IMAGE URL: " + imageUrl);
            user.setProfileImage(imageUrl);
        }

        User savedUser = userRepository.save(user);
        savedUser.setProfileImage(toPublicImageUrl(savedUser.getProfileImage()));
        return savedUser;
    }

    private String toPublicImageUrl(String imageUrl) {
        if (!StringUtils.hasText(imageUrl)) {
            return imageUrl;
        }

        if (imageUrl.startsWith("blob:")) {
            return imageUrl;
        }

        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            int uploadsIndex = imageUrl.indexOf("/uploads/");
            if (uploadsIndex >= 0 && StringUtils.hasText(baseUrl) && !imageUrl.startsWith(baseUrl + "/")) {
                return baseUrl + imageUrl.substring(uploadsIndex);
            }
            return imageUrl;
        }

        if (!StringUtils.hasText(baseUrl)) {
            return imageUrl;
        }

        String normalizedPath = imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl;

        return baseUrl + normalizedPath;
    }

    private String resolveBaseUrl(HttpServletRequest request) {
        if (StringUtils.hasText(baseUrl)) {
            return baseUrl;
        }

        return ServletUriComponentsBuilder.fromRequestUri(request)
                .replacePath(null)
                .build()
                .toUriString();
    }

    private String normalizeBaseUrl(String value) {
        if (!StringUtils.hasText(value)) {
            return "";
        }

        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
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
}
