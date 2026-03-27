package com.localservicefinder.controller;

import com.localservicefinder.service.ProviderAnalyticsService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/provider/analytics")
@PreAuthorize("hasRole('PROVIDER')")
public class ProviderAnalyticsController {

    private final ProviderAnalyticsService analyticsService;

    public ProviderAnalyticsController(
            ProviderAnalyticsService analyticsService) {

        this.analyticsService = analyticsService;
    }


    @GetMapping("/categories")
    public List<Map<String,Object>> categories(
            Authentication authentication){

        return analyticsService
                .getCategoryPerformance(authentication.getName());
    }


    @GetMapping("/earnings")
    public List<Map<String,Object>> earnings(
            Authentication authentication){

        return analyticsService
                .getMonthlyEarnings(authentication.getName());
    }


    @GetMapping("/status")
    public List<Map<String,Object>> status(
            Authentication authentication){

        return analyticsService
                .getJobStatusDistribution(authentication.getName());
    }


    @GetMapping("/top-services")
    public List<Map<String,Object>> topServices(
            Authentication authentication){

        return analyticsService
                .getTopServices(authentication.getName());
    }

}
