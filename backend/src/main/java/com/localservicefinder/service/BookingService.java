package com.localservicefinder.service;

import com.localservicefinder.dto.BookingDtos;

import java.util.List;
import java.util.Map;

public interface BookingService {

    BookingDtos.BookingResponse create(BookingDtos.BookingRequest request, String userEmail);

    List<BookingDtos.BookingResponse> userBookings(String userEmail);

    List<BookingDtos.BookingResponse> providerBookings(String providerEmail);

    BookingDtos.BookingResponse updateStatus(Long bookingId,
                                             BookingDtos.BookingStatusRequest request,
                                             String providerEmail);

    /* COMPLETE BOOKING */

    void completeBooking(Long bookingId, String providerEmail);

    /* USER PROFILE STATS */

    Map<String, Long> userStats(String userEmail);
}