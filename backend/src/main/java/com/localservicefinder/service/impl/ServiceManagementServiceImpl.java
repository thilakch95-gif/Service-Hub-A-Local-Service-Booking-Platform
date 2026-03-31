package com.localservicefinder.service.impl;

import com.localservicefinder.dto.ServiceDtos;
import com.localservicefinder.exception.NotFoundException;
import com.localservicefinder.exception.UnauthorizedException;
import com.localservicefinder.model.Role;
import com.localservicefinder.model.ServiceEntity;
import com.localservicefinder.model.User;
import com.localservicefinder.model.Booking;
import com.localservicefinder.repository.BookingRepository;
import com.localservicefinder.repository.PaymentRepository;
import com.localservicefinder.repository.RatingRepository;
import com.localservicefinder.repository.ServiceRepository;
import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.service.ServiceManagementService;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceManagementServiceImpl implements ServiceManagementService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final RatingRepository ratingRepository;

    public ServiceManagementServiceImpl(ServiceRepository serviceRepository,
                                        UserRepository userRepository,
                                        BookingRepository bookingRepository,
                                        PaymentRepository paymentRepository,
                                        RatingRepository ratingRepository) {
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.ratingRepository = ratingRepository;
    }

    @Override
    public ServiceDtos.ServiceResponse create(ServiceDtos.ServiceRequest request, String providerEmail) {

        User provider = requireProvider(providerEmail);

        ServiceEntity entity = new ServiceEntity();
        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setCategory(request.getCategory());
        entity.setPrice(request.getPrice());
        entity.setLocation(request.getLocation());
        entity.setProvider(provider);

        entity = serviceRepository.save(entity);

        return map(entity);
    }

    @Override
    public ServiceDtos.ServiceResponse update(Long id, ServiceDtos.ServiceRequest request, String providerEmail) {

        ServiceEntity entity = serviceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Service not found"));

        if (!entity.getProvider().getEmail().equals(providerEmail)) {
            throw new UnauthorizedException("Only service owner provider can update this service");
        }

        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setCategory(request.getCategory());
        entity.setPrice(request.getPrice());
        entity.setLocation(request.getLocation());

        entity = serviceRepository.save(entity);

        return map(entity);
    }

    @Override
    @Transactional
    public void delete(Long id, String providerEmail) {

        ServiceEntity entity = serviceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Service not found"));

        if (!entity.getProvider().getEmail().equals(providerEmail)) {
            throw new UnauthorizedException("Only service owner provider can delete this service");
        }

        java.util.List<Booking> relatedBookings = bookingRepository.findByService(entity);
        java.util.List<Long> bookingIds = relatedBookings.stream()
                .map(Booking::getId)
                .toList();

        if (!bookingIds.isEmpty()) {
            ratingRepository.deleteByBookingIdIn(bookingIds);
            paymentRepository.deleteByBookingIdIn(bookingIds);
            bookingRepository.deleteAll(relatedBookings);
        }

        serviceRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceDtos.ServiceResponse getById(Long id) {

        ServiceEntity entity = serviceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Service not found"));

        return map(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceDtos.ServiceResponse> list(String category, String location, int page, int size) {

        Page<ServiceEntity> result =
                serviceRepository.findByCategoryContainingIgnoreCaseAndLocationContainingIgnoreCase(
                        category == null ? "" : category,
                        location == null ? "" : location,
                        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
                );

        return result.map(this::map);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceDtos.ServiceResponse> providerServices(String providerEmail, int page, int size) {

        User provider = requireProvider(providerEmail);

        return serviceRepository.findByProvider(
                provider,
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        ).map(this::map);
    }

    private User requireProvider(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Provider not found"));

        if (user.getRole() != Role.PROVIDER) {
            throw new UnauthorizedException("Only providers can manage services");
        }

        return user;
    }

    public ServiceDtos.ServiceResponse map(ServiceEntity entity) {

        ServiceDtos.ServiceResponse response = new ServiceDtos.ServiceResponse();
        User provider = entity.getProvider();

        response.setId(entity.getId());
        response.setTitle(entity.getTitle());
        response.setDescription(entity.getDescription());
        response.setCategory(entity.getCategory());
        response.setPrice(entity.getPrice());
        response.setLocation(entity.getLocation());
        response.setProviderId(provider != null ? provider.getId() : null);
        response.setProviderName(provider != null ? provider.getFullName() : "Unknown provider");
        response.setCreatedAt(entity.getCreatedAt());

        return response;
    }
}
