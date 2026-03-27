package com.localservicefinder.repository;

import com.localservicefinder.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    /* ================= PROVIDER REVIEWS ================= */

    // All reviews of a provider
    List<Rating> findByProviderId(Long providerId);

    /* ================= DUPLICATE REVIEW PROTECTION ================= */

    // Prevent duplicate review (same booking + user)
    boolean existsByBookingIdAndUserId(Long bookingId, Long userId);

    // Check if booking already has review
    boolean existsByBookingId(Long bookingId);

    /* ================= PROVIDER RATING STATS ================= */

    // Average rating of provider
    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.providerId = :providerId")
    Double getAverageRating(Long providerId);

    // Total review count
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.providerId = :providerId")
    Long getTotalReviews(Long providerId);

    // Rating breakdown (1⭐ 2⭐ 3⭐ 4⭐ 5⭐)
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.providerId = :providerId AND r.stars = :stars")
    Long countByProviderIdAndStars(Long providerId, int stars);

    /* ================= USER REVIEWS ================= */

    List<Rating> findByUserId(Long userId);

    long deleteByProviderId(Long providerId);

    long deleteByUserId(Long userId);

    long deleteByBookingIdIn(List<Long> bookingIds);

}
