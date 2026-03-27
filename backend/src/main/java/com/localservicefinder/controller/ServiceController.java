package com.localservicefinder.controller;

import com.localservicefinder.dto.ApiResponse;
import com.localservicefinder.dto.ServiceDtos;
import com.localservicefinder.service.ServiceManagementService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceManagementService serviceManagementService;

    public ServiceController(ServiceManagementService serviceManagementService) {
        this.serviceManagementService = serviceManagementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ServiceDtos.ServiceResponse>>> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Services fetched",
                        serviceManagementService.list(category, location, page, size)
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceDtos.ServiceResponse>> getById(@PathVariable Long id) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Service fetched",
                        serviceManagementService.getById(id)
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceDtos.ServiceResponse>> create(
            @Valid @RequestBody ServiceDtos.ServiceRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Service created",
                        serviceManagementService.create(request, authentication.getName())
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceDtos.ServiceResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ServiceDtos.ServiceRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Service updated",
                        serviceManagementService.update(id, request, authentication.getName())
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(
            @PathVariable Long id,
            Authentication authentication) {

        serviceManagementService.delete(id, authentication.getName());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Service deleted",
                        null
                )
        );
    }

    @GetMapping("/provider/me")
    public ResponseEntity<ApiResponse<Page<ServiceDtos.ServiceResponse>>> providerServices(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Provider services fetched",
                        serviceManagementService.providerServices(authentication.getName(), page, size)
                )
        );
    }
}