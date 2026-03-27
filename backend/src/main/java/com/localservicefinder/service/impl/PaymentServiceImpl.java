package com.localservicefinder.service.impl;

import com.localservicefinder.dto.PaymentRequest;
import com.localservicefinder.dto.PaymentResponse;
import com.localservicefinder.exception.NotFoundException;
import com.localservicefinder.model.Payment;
import com.localservicefinder.model.User;
import com.localservicefinder.repository.PaymentRepository;
import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.service.PaymentService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final BookingServiceImpl bookingService;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              UserRepository userRepository,
                              BookingServiceImpl bookingService) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.bookingService = bookingService;
    }

    /* CARD / UPI PAYMENT */

    @Override
    public PaymentResponse makePayment(PaymentRequest request, String userEmail) {

        if (paymentRepository.existsByBookingId(request.getBookingId())) {
            throw new RuntimeException("Payment already completed for this booking");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Payment payment = new Payment(
                request.getBookingId(),
                request.getAmount(),
                "SUCCESS",
                LocalDateTime.now(),
                user.getId()
        );

        Payment saved = paymentRepository.save(payment);

        // confirm booking
        bookingService.confirmBookingAfterPayment(request.getBookingId());

        return new PaymentResponse(
                saved.getId(),
                saved.getBookingId(),
                saved.getAmount(),
                saved.getStatus(),
                saved.getPaidAt()
        );
    }


    /* USER PAYMENT HISTORY */

    @Override
    public List<PaymentResponse> getUserPayments(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<Payment> payments = paymentRepository.findByUserId(user.getId());

        List<PaymentResponse> responses = new ArrayList<>();

        for (Payment p : payments) {
            responses.add(new PaymentResponse(
                    p.getId(),
                    p.getBookingId(),
                    p.getAmount(),
                    p.getStatus(),
                    p.getPaidAt()
            ));
        }

        return responses;
    }


    /* QR PAYMENT CONFIRMATION */

    @Override
    public void confirmQrPayment(PaymentRequest request) {

        if (paymentRepository.existsByBookingId(request.getBookingId())) {
            return;
        }

        Payment payment = new Payment(
                request.getBookingId(),
                request.getAmount(),
                "SUCCESS",
                LocalDateTime.now(),
                null
        );

        paymentRepository.save(payment);

        bookingService.confirmBookingAfterPayment(request.getBookingId());
    }


    /* CHECK PAYMENT STATUS */

    @Override
    public boolean isBookingPaid(Long bookingId) {

        return paymentRepository.existsByBookingId(bookingId);
    }
}
