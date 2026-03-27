package com.localservicefinder.controller;

import com.localservicefinder.dto.ApiResponse;
import com.localservicefinder.dto.BookingDtos;
import com.localservicefinder.service.BookingService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }    /* CREATE BOOKING */

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDtos.BookingResponse>> create(
            @Valid @RequestBody BookingDtos.BookingRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Booking created",
                        bookingService.create(request, authentication.getName())
                )
        );
    }

    /* USER BOOKINGS */

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<BookingDtos.BookingResponse>>> myBookings(
            Authentication authentication) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "User bookings fetched",
                        bookingService.userBookings(authentication.getName())
                )
        );
    }

    /* PROVIDER BOOKINGS */

    @GetMapping("/provider/me")
    public ResponseEntity<ApiResponse<List<BookingDtos.BookingResponse>>> providerBookings(
            Authentication authentication) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Provider bookings fetched",
                        bookingService.providerBookings(authentication.getName())
                )
        );
    }

    /* UPDATE BOOKING STATUS */

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<ApiResponse<BookingDtos.BookingResponse>> updateStatus(
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingDtos.BookingStatusRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Booking status updated",
                        bookingService.updateStatus(bookingId, request, authentication.getName())
                )
        );
    }
    @PatchMapping("/{bookingId}/complete")
    public ResponseEntity<ApiResponse<String>> completeBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        bookingService.completeBooking(bookingId, authentication.getName());

        return ResponseEntity.ok(
                new ApiResponse<>(200, "Booking completed", null)
        );
    }

    /* USER PROFILE STATS */

    @GetMapping("/user/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> userStats(
            Authentication authentication) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "User statistics fetched",
                        bookingService.userStats(authentication.getName())
                )
        );
    }

}