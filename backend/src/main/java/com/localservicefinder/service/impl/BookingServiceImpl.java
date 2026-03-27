package com.localservicefinder.service.impl;

import com.localservicefinder.dto.BookingDtos;
import com.localservicefinder.exception.NotFoundException;
import com.localservicefinder.exception.UnauthorizedException;
import com.localservicefinder.model.*;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.ServiceRepository;
import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.service.BookingService;
import com.localservicefinder.service.NotificationService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              ServiceRepository serviceRepository,
                              UserRepository userRepository,
                              NotificationService notificationService) {

        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    /* CREATE BOOKING */

    @Override
    public BookingDtos.BookingResponse create(BookingDtos.BookingRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (user.getRole() != Role.USER) {
            throw new UnauthorizedException("Only users can create bookings");
        }

        ServiceEntity service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new NotFoundException("Service not found"));

        Booking booking = new Booking();
        booking.setService(service);
        booking.setUser(user);
        booking.setServiceDate(request.getServiceDate());
        booking.setNotes(request.getNotes());
        booking.setStatus(BookingStatus.PENDING);

        booking = bookingRepository.save(booking);

        /* BOOKING CREATED NOTIFICATION */

        notificationService.createNotification(
                user.getId(),
                "Your booking for " + service.getTitle() + " has been created."
        );

        return map(booking);
    }

    /* USER BOOKINGS */

    @Override
    public List<BookingDtos.BookingResponse> userBookings(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return bookingRepository.findByUser(user)
                .stream()
                .map(this::map)
                .toList();
    }

    /* PROVIDER BOOKINGS */

    @Override
    public List<BookingDtos.BookingResponse> providerBookings(String providerEmail) {

        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new NotFoundException("Provider not found"));

        if (provider.getRole() != Role.PROVIDER) {
            throw new UnauthorizedException("Only providers can view provider bookings");
        }

        return bookingRepository.findByServiceProvider(provider)
                .stream()
                .map(this::map)
                .toList();
    }

    /* UPDATE BOOKING STATUS */

    @Override
    public BookingDtos.BookingResponse updateStatus(Long bookingId,
                                                    BookingDtos.BookingStatusRequest request,
                                                    String providerEmail) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));

        if (!booking.getService().getProvider().getEmail().equals(providerEmail)) {
            throw new UnauthorizedException("Only associated provider can update booking status");
        }

        if (request.getStatus() != BookingStatus.APPROVED &&
            request.getStatus() != BookingStatus.DECLINED) {
            throw new UnauthorizedException("Providers can set only APPROVED or DECLINED status");
        }

        booking.setStatus(request.getStatus());

        booking = bookingRepository.save(booking);

        /* APPROVED NOTIFICATION */

        if (request.getStatus() == BookingStatus.APPROVED) {

            notificationService.createNotification(
                    booking.getUser().getId(),
                    "Your booking for " + booking.getService().getTitle() + " has been approved."
            );

        }

        /* DECLINED NOTIFICATION */

        if (request.getStatus() == BookingStatus.DECLINED) {

            notificationService.createNotification(
                    booking.getUser().getId(),
                    "Your booking for " + booking.getService().getTitle() + " has been declined."
            );

        }

        return map(booking);
    }

    /* USER PROFILE STATS */

    @Override
    public Map<String, Long> userStats(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        long totalOrders = bookingRepository.countByUser(user);

        long completedOrders =
                bookingRepository.countByUserAndStatus(user, BookingStatus.COMPLETED);

        long pendingOrders =
                bookingRepository.countByUserAndStatus(user, BookingStatus.PENDING);

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalOrders", totalOrders);
        stats.put("completedOrders", completedOrders);
        stats.put("pendingOrders", pendingOrders);

        return stats;
    }

    /* BOOKING DTO MAPPER */

    public BookingDtos.BookingResponse map(Booking booking) {

        BookingDtos.BookingResponse response = new BookingDtos.BookingResponse();

        response.setId(booking.getId());
        response.setServiceId(booking.getService().getId());
        response.setServiceTitle(booking.getService().getTitle());
        response.setUserId(booking.getUser().getId());
        response.setUserName(booking.getUser().getFullName());
        response.setStatus(booking.getStatus());
        response.setServiceDate(booking.getServiceDate());
        response.setNotes(booking.getNotes());
        response.setCreatedAt(booking.getCreatedAt());
        response.setPrice(booking.getService().getPrice());
        return response;
    }

    /* CONFIRM BOOKING AFTER PAYMENT */

    public void confirmBookingAfterPayment(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new UnauthorizedException("Booking must be APPROVED before payment");
        }

        booking.setStatus(BookingStatus.CONFIRMED);

        bookingRepository.save(booking);

        /* PAYMENT SUCCESS NOTIFICATION */

        notificationService.createNotification(
                booking.getUser().getId(),
                "Payment successful for " + booking.getService().getTitle() + ". Your booking is confirmed."
        );
    }
    /* COMPLETE BOOKING */

    public void completeBooking(Long bookingId, String providerEmail) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));

        if (!booking.getService().getProvider().getEmail().equals(providerEmail)) {
            throw new UnauthorizedException("Only provider can complete booking");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new UnauthorizedException("Booking must be CONFIRMED first");
        }

        /* PROVIDER EARNING CALCULATION */

        java.math.BigDecimal price = booking.getService().getPrice();

        java.math.BigDecimal providerEarning =
                price.subtract(price.multiply(java.math.BigDecimal.valueOf(0.10)));

        booking.setProviderEarning(providerEarning.doubleValue());

        booking.setStatus(BookingStatus.COMPLETED);

        bookingRepository.save(booking);

        /* SERVICE COMPLETED NOTIFICATION */

        notificationService.createNotification(
                booking.getUser().getId(),
                "Your service for " + booking.getService().getTitle() + " has been completed."
        );
    }
}