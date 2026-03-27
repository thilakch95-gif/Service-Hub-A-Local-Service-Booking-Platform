package com.localservicefinder.service;

import com.localservicefinder.dto.ProviderDashboardStatsDTO;

public interface ProviderDashboardService {

    ProviderDashboardStatsDTO getDashboardStats(String providerEmail);

}