package com.localservicefinder.service.impl;

import com.localservicefinder.dto.AuthDtos;
import com.localservicefinder.exception.BadRequestException;
import com.localservicefinder.model.Role;
import com.localservicefinder.model.User;
import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.security.JwtService;
import com.localservicefinder.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        Role role = request.getRole() == null ? Role.USER : request.getRole();
        if (role == Role.ADMIN) {
            throw new BadRequestException("Admin accounts cannot be created from public registration");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setActive(true);

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return new AuthDtos.AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Override
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return new AuthDtos.AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}

