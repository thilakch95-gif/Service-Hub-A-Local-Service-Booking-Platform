package com.localservicefinder.service;

import com.localservicefinder.model.Rating;
import com.localservicefinder.dto.RatingResponse;

import java.util.List;
import java.util.Map;

public interface RatingService {

    /* USER SUBMIT REVIEW */
    Rating submitRating(Long bookingId, int stars, String comment, String userEmail);

    /* GET ALL REVIEWS FOR A PROVIDER */
    List<RatingResponse> getProviderRatings(Long providerId);

    /* PROVIDER RATING STATISTICS */
    Map<String, Object> getProviderRatingStats(Long providerId);

    /* CHECK IF BOOKING ALREADY REVIEWED */
    boolean isBookingReviewed(Long bookingId, String userEmail);

    /* ADMIN DELETE REVIEW */
    void deleteRating(Long ratingId);

    /* ---------------- NEW METHODS ---------------- */

    /* PROVIDER: GET MY RATINGS */
    List<RatingResponse> getMyProviderRatings(String email);

    /* PROVIDER: GET MY RATING STATS */
    Map<String, Object> getMyProviderRatingStats(String email);
    /* USER: GET MY REVIEWS */
    List<RatingResponse> getUserReviews(String email);

    /* ADMIN: GET ALL REVIEWS */
    List<Rating> getAllRatings();
}