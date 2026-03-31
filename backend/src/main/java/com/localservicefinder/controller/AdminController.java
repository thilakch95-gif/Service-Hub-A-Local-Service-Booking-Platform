package com.localservicefinder.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.localservicefinder.dto.AdminDtos;
import com.localservicefinder.exception.BadRequestException;
import com.localservicefinder.exception.NotFoundException;
import com.localservicefinder.model.Role;
import com.localservicefinder.model.User;
import com.localservicefinder.model.ServiceEntity;
import com.localservicefinder.model.Booking;

import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.repository.ServiceRepository;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.NotificationRepository;
import com.localservicefinder.repository.PaymentRepository;
import com.localservicefinder.repository.RatingRepository;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /* =========================
       ADMIN DASHBOARD STATS
    ========================= */

    @GetMapping("/stats")
    public Map<String, Long> getStats(){

        Map<String, Long> stats = new HashMap<>();

        stats.put("users", userRepository.count());
        stats.put("providers", userRepository.countProviders());
        stats.put("services", serviceRepository.count());
        stats.put("bookings", bookingRepository.count());

        return stats;
    }

    /* =========================
       GET ALL USERS
    ========================= */

    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userRepository.findByRole(Role.USER);
    }

    @PostMapping("/users")
    public User createUser(@Valid @RequestBody AdminDtos.AccountRequest request) {
        return createAccount(request, Role.USER);
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        deleteAccount(id, Role.USER);
        return ResponseEntity.noContent().build();
    }

    /* =========================
       GET ALL PROVIDERS
    ========================= */

    @GetMapping("/providers")
    public List<User> getProviders(){
        return userRepository.findProviders();
    }

    @PostMapping("/providers")
    public User createProvider(@Valid @RequestBody AdminDtos.AccountRequest request) {
        return createAccount(request, Role.PROVIDER);
    }

    @DeleteMapping("/providers/{id}")
    @Transactional
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        deleteAccount(id, Role.PROVIDER);
        return ResponseEntity.noContent().build();
    }

    /* =========================
       GET ALL SERVICES
    ========================= */

    @GetMapping("/services")
    public List<ServiceEntity> getAllServices(){
        return serviceRepository.findAll();
    }

    /* =========================
       GET ALL BOOKINGS
    ========================= */

    @GetMapping("/bookings")
    public List<Booking> getAllBookings(){
        return bookingRepository.findAll();
    }

    private User createAccount(AdminDtos.AccountRequest request, Role role) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setPhone(request.getPhone());
        user.setProfileImage(normalizeProfileImage(request.getProfileImage()));
        user.setBio(request.getBio());
        user.setActive(true);

        return userRepository.save(user);
    }

    private String normalizeProfileImage(String profileImage) {
        if (profileImage == null || profileImage.isBlank()) {
            return null;
        }

        String trimmed = profileImage.trim();
        if (!trimmed.startsWith("https://") && !trimmed.startsWith("http://")) {
            throw new BadRequestException("Profile image must be a public image URL");
        }

        return trimmed;
    }

    private void deleteAccount(Long id, Role expectedRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Account not found"));

        if (user.getRole() != expectedRole) {
            throw new BadRequestException("Selected account is not a " + expectedRole.name().toLowerCase());
        }

        List<Booking> relatedBookings = expectedRole == Role.PROVIDER
                ? bookingRepository.findByServiceProvider(user)
                : bookingRepository.findByUser(user);

        List<Long> bookingIds = relatedBookings.stream()
                .map(Booking::getId)
                .collect(Collectors.toList());

        if (!bookingIds.isEmpty()) {
            ratingRepository.deleteByBookingIdIn(bookingIds);
            paymentRepository.deleteByBookingIdIn(bookingIds);
        }

        ratingRepository.deleteByUserId(user.getId());
        paymentRepository.deleteByUserId(user.getId());
        notificationRepository.deleteByUserId(user.getId());

        if (expectedRole == Role.PROVIDER) {
            ratingRepository.deleteByProviderId(user.getId());

            List<ServiceEntity> services = serviceRepository.findByProvider(user);
            if (!relatedBookings.isEmpty()) {
                bookingRepository.deleteAll(relatedBookings);
            }
            if (!services.isEmpty()) {
                serviceRepository.deleteAll(services);
            }
        } else if (!relatedBookings.isEmpty()) {
            bookingRepository.deleteAll(relatedBookings);
        }

        userRepository.delete(user);
    }

}
