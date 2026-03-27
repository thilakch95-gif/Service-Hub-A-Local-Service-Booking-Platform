package com.localservicefinder.service.impl;

import com.localservicefinder.dto.RatingResponse;
import com.localservicefinder.exception.BadRequestException;
import com.localservicefinder.exception.NotFoundException;
import com.localservicefinder.model.*;
import com.localservicefinder.repository.*;
import com.localservicefinder.service.RatingService;
import com.localservicefinder.service.NotificationService;
import com.localservicefinder.exception.UnauthorizedException;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public RatingServiceImpl(RatingRepository ratingRepository,
                             BookingRepository bookingRepository,
                             UserRepository userRepository,
                             NotificationService notificationService) {

        this.ratingRepository = ratingRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    /* SUBMIT RATING */

    @Override
    public Rating submitRating(Long bookingId, int stars, String comment, String userEmail) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Service must be completed before rating");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can review only your own booking");
        }

        if (ratingRepository.existsByBookingIdAndUserId(bookingId, user.getId())) {
            throw new BadRequestException("You have already reviewed this booking");
        }

        if (stars < 1 || stars > 5) {
            throw new BadRequestException("Rating must be between 1 and 5 stars");
        }

        if (comment == null || comment.trim().isEmpty()) {
            throw new BadRequestException("Comment cannot be empty");
        }

        Long providerId = booking.getService().getProvider().getId();

        Rating rating = new Rating(
                bookingId,
                providerId,
                user.getId(),
                stars,
                comment.trim()
        );

        rating = ratingRepository.save(rating);

        /* NOTIFY PROVIDER ABOUT NEW REVIEW */

        notificationService.createNotification(
                providerId,
                "You received a new review for " + booking.getService().getTitle()
        );

        return rating;
    }

    /* GET PROVIDER REVIEWS */

    @Override
    public List<RatingResponse> getProviderRatings(Long providerId) {

        List<Rating> ratings = ratingRepository.findByProviderId(providerId);

        return ratings.stream().map(r -> {

            User user = userRepository.findById(r.getUserId())
                    .orElse(null);

            String reviewerName = user != null ? user.getFullName() : "Unknown User";

            return new RatingResponse(
                    r.getId(),
                    r.getStars(),
                    r.getComment(),
                    reviewerName,
                    r.getCreatedAt()
            );

        }).toList();
    }

    /* PROVIDER RATING STATS */

    @Override
    public Map<String, Object> getProviderRatingStats(Long providerId) {

        Double average = ratingRepository.getAverageRating(providerId);
        Long total = ratingRepository.getTotalReviews(providerId);

        Long five = ratingRepository.countByProviderIdAndStars(providerId, 5);
        Long four = ratingRepository.countByProviderIdAndStars(providerId, 4);
        Long three = ratingRepository.countByProviderIdAndStars(providerId, 3);
        Long two = ratingRepository.countByProviderIdAndStars(providerId, 2);
        Long one = ratingRepository.countByProviderIdAndStars(providerId, 1);

        Map<String, Object> stats = new HashMap<>();

        stats.put("averageRating", average == null ? 0 : Math.round(average * 10.0) / 10.0);
        stats.put("totalReviews", total);

        stats.put("fiveStar", five);
        stats.put("fourStar", four);
        stats.put("threeStar", three);
        stats.put("twoStar", two);
        stats.put("oneStar", one);

        return stats;
    }

    /* CHECK IF BOOKING ALREADY REVIEWED */

    @Override
    public boolean isBookingReviewed(Long bookingId, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return ratingRepository.existsByBookingIdAndUserId(bookingId, user.getId());
    }

    /* ADMIN DELETE REVIEW */

    @Override
    public void deleteRating(Long ratingId) {

        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new NotFoundException("Rating not found"));

        ratingRepository.delete(rating);
    }

    /* PROVIDER DASHBOARD STATS */

    @Override
    public Map<String, Object> getMyProviderRatingStats(String email) {

        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Provider not found"));

        Long providerId = provider.getId();

        return getProviderRatingStats(providerId);
    }

    @Override
    public List<RatingResponse> getMyProviderRatings(String email) {

        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Provider not found"));

        Long providerId = provider.getId();

        return getProviderRatings(providerId);
    }

    @Override
    public List<Rating> getAllRatings() {

        return ratingRepository.findAll();

    }
    /* USER: GET MY REVIEWS */

    @Override
    public List<RatingResponse> getUserReviews(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<Rating> ratings = ratingRepository.findByUserId(user.getId());

        return ratings.stream().map(r -> {

            return new RatingResponse(
                    r.getId(),
                    r.getStars(),
                    r.getComment(),
                    user.getFullName(),
                    r.getCreatedAt()
            );

        }).toList();
    }
    
}
