package com.localservicefinder.service.impl;

import com.localservicefinder.exception.NotFoundException;
import com.localservicefinder.exception.UnauthorizedException;
import com.localservicefinder.model.Role;
import com.localservicefinder.model.User;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.service.ProviderAnalyticsService;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProviderAnalyticsServiceImpl implements ProviderAnalyticsService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public ProviderAnalyticsServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    private User getProvider(String email) {
        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Provider not found"));

        if (provider.getRole() != Role.PROVIDER) {
            throw new UnauthorizedException("Only providers can access provider analytics");
        }

        return provider;
    }

    /* CATEGORY PERFORMANCE */

    @Override
    public List<Map<String,Object>> getCategoryPerformance(String providerEmail) {

        Long providerId = getProvider(providerEmail).getId();

        List<Object[]> results =
                bookingRepository.getCategoryPerformance(providerId);

        List<Map<String,Object>> response = new ArrayList<>();

        for(Object[] row : results){

            Map<String,Object> map = new HashMap<>();

            map.put("category", row[0]);
            map.put("totalBookings", row[1]);

            response.add(map);
        }

        return response;
    }


    /* MONTHLY EARNINGS */

    @Override
    public List<Map<String,Object>> getMonthlyEarnings(String providerEmail) {

        Long providerId = getProvider(providerEmail).getId();

        List<Object[]> results =
                bookingRepository.getMonthlyEarnings(providerId);

        List<Map<String,Object>> response = new ArrayList<>();

        for(Object[] row : results){

            Map<String,Object> map = new HashMap<>();

            map.put("month", row[0]);
            map.put("earnings", row[1] == null ? 0 : row[1]);

            response.add(map);
        }

        return response;
    }


    /* JOB STATUS */

    @Override
    public List<Map<String,Object>> getJobStatusDistribution(String providerEmail) {

        Long providerId = getProvider(providerEmail).getId();

        List<Object[]> results =
                bookingRepository.getJobStatusDistribution(providerId);

        List<Map<String,Object>> response = new ArrayList<>();

        for(Object[] row : results){

            Map<String,Object> map = new HashMap<>();

            map.put("status", row[0]);
            map.put("value", row[1]);

            response.add(map);
        }

        return response;
    }


    /* TOP SERVICES */

    @Override
    public List<Map<String,Object>> getTopServices(String providerEmail) {

        Long providerId = getProvider(providerEmail).getId();

        List<Object[]> results =
                bookingRepository.getTopServices(providerId);

        List<Map<String,Object>> response = new ArrayList<>();

        for(Object[] row : results){

            Map<String,Object> map = new HashMap<>();

            map.put("serviceName", row[0]);
            map.put("bookings", row[1]);

            response.add(map);
        }

        return response;
    }

}
