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
    private final String demoUserEmail;
    private final String demoUserPassword;
    private final String demoProviderEmail;
    private final String demoProviderPassword;
    private final String demoAdminEmail;
    private final String demoAdminPassword;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.admin.name:System Admin}") String adminName,
                           @Value("${app.admin.email:admin@localservice.com}") String adminEmail,
                           @Value("${app.admin.password:Admin@123}") String adminPassword,
                           @Value("${app.demo.user.email:user@demo.com}") String demoUserEmail,
                           @Value("${app.demo.user.password:User@123}") String demoUserPassword,
                           @Value("${app.demo.provider.email:provider@demo.com}") String demoProviderEmail,
                           @Value("${app.demo.provider.password:Provider@123}") String demoProviderPassword,
                           @Value("${app.demo.admin.email:admin@demo.com}") String demoAdminEmail,
                           @Value("${app.demo.admin.password:Admin@123}") String demoAdminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminName = adminName;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.demoUserEmail = demoUserEmail;
        this.demoUserPassword = demoUserPassword;
        this.demoProviderEmail = demoProviderEmail;
        this.demoProviderPassword = demoProviderPassword;
        this.demoAdminEmail = demoAdminEmail;
        this.demoAdminPassword = demoAdminPassword;
    }

    @Override
    public void run(String... args) {

        upsertUser(adminName, adminEmail, adminPassword, Role.ADMIN);
        upsertUser("Demo User", demoUserEmail, demoUserPassword, Role.USER);
        upsertUser("Demo Provider", demoProviderEmail, demoProviderPassword, Role.PROVIDER);
        upsertUser("Demo Admin", demoAdminEmail, demoAdminPassword, Role.ADMIN);
    }

    private void upsertUser(String fullName, String email, String rawPassword, Role role) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);

        user.setFullName(fullName);
        user.setEmail(email);
        user.setRole(role);
        user.setActive(true);

        if (user.getPassword() == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(rawPassword));
        }

        userRepository.save(user);
    }
}
