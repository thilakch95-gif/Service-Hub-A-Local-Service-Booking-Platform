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
    private final String publicBaseUrl;

    public UserController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          @Value("${app.upload-dir}") String uploadDir,
                          @Value("${app.public-base-url:}") String publicBaseUrl) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.publicBaseUrl = publicBaseUrl == null ? "" : publicBaseUrl.trim();
    }

    @GetMapping("/profile")
    public User getProfile(Authentication authentication) {

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
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

            String baseUrl = resolveBaseUrl(request);
            user.setProfileImage(baseUrl + "/uploads/" + fileName);
        }

        return userRepository.save(user);
    }

    private String resolveBaseUrl(HttpServletRequest request) {
        if (StringUtils.hasText(publicBaseUrl)) {
            return publicBaseUrl.endsWith("/")
                    ? publicBaseUrl.substring(0, publicBaseUrl.length() - 1)
                    : publicBaseUrl;
        }

        return ServletUriComponentsBuilder.fromRequestUri(request)
                .replacePath(null)
                .build()
                .toUriString();
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
