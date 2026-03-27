package com.localservicefinder.controller;

import com.localservicefinder.dto.PaymentRequest;
import com.localservicefinder.dto.PaymentResponse;
import com.localservicefinder.service.PaymentService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /* NORMAL PAYMENT (CARD / UPI FROM LOGGED-IN USER) */

    @PostMapping
    public PaymentResponse makePayment(@RequestBody PaymentRequest request,
                                       Authentication authentication) {

        String userEmail = authentication.getName();

        return paymentService.makePayment(request, userEmail);
    }


    /* USER PAYMENT HISTORY */

    @GetMapping("/me")
    public List<PaymentResponse> getMyPayments(Authentication authentication) {

        return paymentService.getUserPayments(authentication.getName());
    }


    /* QR PAYMENT CONFIRMATION (NO LOGIN REQUIRED) */

    @PostMapping("/confirm")
    public String confirmPayment(@RequestBody PaymentRequest request) {

        paymentService.confirmQrPayment(request);

        return "Payment Confirmed";
    }


    /* CHECK PAYMENT STATUS (USED BY LAPTOP POLLING) */

    @GetMapping("/status/{bookingId}")
    public String checkPaymentStatus(@PathVariable Long bookingId) {

        boolean paid = paymentService.isBookingPaid(bookingId);

        if (paid) {
            return "CONFIRMED";
        }

        return "PENDING";
    }
}
