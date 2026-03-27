package com.localservicefinder.controller;

import com.localservicefinder.exception.BadRequestException;
import com.localservicefinder.model.Rating;
import com.localservicefinder.service.RatingService;
import com.localservicefinder.dto.RatingResponse;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    /* SUBMIT REVIEW */

    /* SUBMIT REVIEW */

    @PostMapping
    public Rating submitRating(@RequestBody Map<String, Object> body,
                               Authentication authentication) {

        Object bookingObj = body.get("bookingId");
        Object starsObj = body.get("stars");
        Object commentObj = body.get("comment");

        if (bookingObj == null || starsObj == null || commentObj == null) {
            throw new BadRequestException("bookingId, stars and comment are required");
        }

        Long bookingId = Long.valueOf(bookingObj.toString());
        int stars = Integer.parseInt(starsObj.toString());
        String comment = commentObj.toString().trim();

        if (comment.isEmpty()) {
            throw new BadRequestException("Comment cannot be empty");
        }

        if (stars < 1 || stars > 5) {
            throw new BadRequestException("Stars must be between 1 and 5");
        }

        return ratingService.submitRating(
                bookingId,
                stars,
                comment,
                authentication.getName()
        );
    }


    /* GET ALL REVIEWS FOR A PROVIDER */

    @GetMapping("/provider/{providerId}")
    public List<RatingResponse> getProviderRatings(@PathVariable Long providerId) {

        return ratingService.getProviderRatings(providerId);
    }


    /* PROVIDER RATING STATISTICS */

    @GetMapping("/stats/{providerId}")
    public Map<String, Object> getProviderRatingStats(@PathVariable Long providerId) {

        return ratingService.getProviderRatingStats(providerId);
    }


    /* CHECK IF BOOKING ALREADY REVIEWED */
    @GetMapping("/booking/{bookingId}")
    public boolean isBookingReviewed(@PathVariable Long bookingId,
                                     Authentication authentication) {

        return ratingService.isBookingReviewed(
                bookingId,
                authentication.getName()
        );
    }

    /* ADMIN DELETE REVIEW */

    @DeleteMapping("/{id}")
    public void deleteRating(@PathVariable Long id) {

        ratingService.deleteRating(id);
    }
    @GetMapping("/stats/me")
    public Map<String, Object> getMyRatingStats(Authentication authentication) {

        String email = authentication.getName();

        return ratingService.getMyProviderRatingStats(email);
    }
    @GetMapping("/provider/me")
    public List<RatingResponse> getMyProviderRatings(Authentication authentication) {

        String email = authentication.getName();

        return ratingService.getMyProviderRatings(email);
    }
    @GetMapping("/admin")
    public List<Rating> getAllRatings() {

        return ratingService.getAllRatings();
    }
    /* USER: GET MY REVIEWS */

    @GetMapping("/my-reviews")
    public List<RatingResponse> myReviews(Authentication authentication) {

        String email = authentication.getName();

        return ratingService.getUserReviews(email);

    }
}
   
    
