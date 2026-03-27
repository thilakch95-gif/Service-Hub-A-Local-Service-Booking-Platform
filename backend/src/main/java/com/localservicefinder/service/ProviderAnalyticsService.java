package com.localservicefinder.service;

import java.util.List;
import java.util.Map;

public interface ProviderAnalyticsService {

    List<Map<String,Object>> getCategoryPerformance(String providerEmail);

    List<Map<String,Object>> getMonthlyEarnings(String providerEmail);

    List<Map<String,Object>> getJobStatusDistribution(String providerEmail);

    List<Map<String,Object>> getTopServices(String providerEmail);

}