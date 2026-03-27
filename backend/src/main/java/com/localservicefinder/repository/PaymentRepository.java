package com.localservicefinder.repository;

import com.localservicefinder.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserId(Long userId);

    boolean existsByBookingId(Long bookingId);

    long deleteByUserId(Long userId);

    long deleteByBookingIdIn(List<Long> bookingIds);
}
