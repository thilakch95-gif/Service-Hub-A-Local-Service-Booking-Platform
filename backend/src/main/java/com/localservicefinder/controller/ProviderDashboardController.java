package com.localservicefinder.controller;

import com.localservicefinder.dto.ProviderDashboardStatsDTO;
import com.localservicefinder.service.ProviderDashboardService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/provider/dashboard")
public class ProviderDashboardController {

    private final ProviderDashboardService dashboardService;

    public ProviderDashboardController(ProviderDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /* =====================================================
                PROVIDER DASHBOARD STATISTICS
       ===================================================== */

    @GetMapping("/stats")
    public ProviderDashboardStatsDTO getDashboardStats(Authentication authentication) {

        String providerEmail = authentication.getName();

        return dashboardService.getDashboardStats(providerEmail);
    }

}