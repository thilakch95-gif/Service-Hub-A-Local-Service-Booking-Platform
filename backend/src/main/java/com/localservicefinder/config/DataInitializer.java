package com.localservicefinder.config;

import com.localservicefinder.model.Role;
import com.localservicefinder.model.User;
import com.localservicefinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminName;
    private final String adminEmail;
    private final String adminPassword;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.admin.name:System Admin}") String adminName,
                           @Value("${app.admin.email:admin@localservice.com}") String adminEmail,
                           @Value("${app.admin.password:Admin@123}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminName = adminName;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {

        userRepository.findByEmail(adminEmail)
                .orElseGet(() -> {

                    User admin = new User();
                    admin.setFullName(adminName);
                    admin.setEmail(adminEmail);
                    admin.setPassword(passwordEncoder.encode(adminPassword));
                    admin.setRole(Role.ADMIN);
                    admin.setActive(true);

                    return userRepository.save(admin);
                });
    }
}
