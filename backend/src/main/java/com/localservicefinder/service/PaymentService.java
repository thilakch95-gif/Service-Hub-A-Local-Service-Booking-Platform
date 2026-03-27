package com.localservicefinder.service;

import com.localservicefinder.dto.PaymentRequest;
import com.localservicefinder.dto.PaymentResponse;

import java.util.List;

public interface PaymentService {

    /* CARD / UPI PAYMENT FROM LOGGED-IN USER */
    PaymentResponse makePayment(PaymentRequest request, String userEmail);

    /* USER PAYMENT HISTORY */
    List<PaymentResponse> getUserPayments(String userEmail);

    /* QR PAYMENT CONFIRMATION FROM PHONE */
    void confirmQrPayment(PaymentRequest request);

    /* CHECK IF PAYMENT COMPLETED (USED BY LAPTOP POLLING) */
    boolean isBookingPaid(Long bookingId);

}
