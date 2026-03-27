package com.localservicefinder.service.impl;

import com.localservicefinder.dto.ProviderDashboardStatsDTO;
import com.localservicefinder.model.BookingStatus;
import com.localservicefinder.model.User;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.RatingRepository;
import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.service.ProviderDashboardService;

import org.springframework.stereotype.Service;

@Service
public class ProviderDashboardServiceImpl implements ProviderDashboardService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final RatingRepository ratingRepository;

    public ProviderDashboardServiceImpl(
            UserRepository userRepository,
            BookingRepository bookingRepository,
            RatingRepository ratingRepository) {

        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.ratingRepository = ratingRepository;
    }

    @Override
    public ProviderDashboardStatsDTO getDashboardStats(String providerEmail) {

        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        /* ================= BOOKINGS ================= */

        long totalBookings = bookingRepository.countByServiceProvider(provider);

        long completedServices =
                bookingRepository.countByServiceProviderAndStatus(provider, BookingStatus.COMPLETED);

        /* ================= RATINGS ================= */

        Double avgRating = ratingRepository.getAverageRating(provider.getId());

        if (avgRating == null) {
            avgRating = 0.0;
        }

        /* ================= EARNINGS ================= */

        Double earnings = bookingRepository.getTotalProviderEarnings(provider.getId());

        if (earnings == null) {
            earnings = 0.0;
        }

        return new ProviderDashboardStatsDTO(
                totalBookings,
                completedServices,
                avgRating,
                earnings
        );
    }
}