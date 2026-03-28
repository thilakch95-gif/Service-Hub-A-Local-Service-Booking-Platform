package com.localservicefinder.controller;

import com.localservicefinder.dto.ProviderProfileResponse;
import com.localservicefinder.dto.ServiceDtos;
import com.localservicefinder.dto.RatingResponse;
import com.localservicefinder.model.User;
import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.repository.ServiceRepository;
import com.localservicefinder.service.RatingService;
import com.localservicefinder.service.ServiceManagementService;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final ServiceManagementService serviceManagementService;
    private final RatingService ratingService;

    public ProviderController(UserRepository userRepository,
                              ServiceRepository serviceRepository,
                              ServiceManagementService serviceManagementService,
                              RatingService ratingService) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.serviceManagementService = serviceManagementService;
        this.ratingService = ratingService;
    }

    /* PROVIDER PROFILE */

    @GetMapping("/{id}")
    public ProviderProfileResponse getProvider(@PathVariable Long id) {

        User provider = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        return new ProviderProfileResponse(
                provider.getId(),
                provider.getFullName(),
                provider.getEmail(),
                provider.getPhone(),
                provider.getBio(),
                provider.getProfileImage()
        );
    }

    /* PROVIDER SERVICES */

    @GetMapping("/{id}/services")
    public List<ServiceDtos.ServiceResponse> getProviderServices(@PathVariable Long id) {

        User provider = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        return serviceRepository.findByProvider(
                provider,
                PageRequest.of(0, 50)
        ).stream()
        .map(serviceManagementService::map)
        .toList();
    }

    /* PROVIDER REVIEWS */

    @GetMapping("/{id}/reviews")
    public List<RatingResponse> getProviderReviews(@PathVariable Long id) {

        return ratingService.getProviderRatings(id);
    }
}
