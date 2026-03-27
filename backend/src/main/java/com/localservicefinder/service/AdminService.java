package com.localservicefinder.service;

import com.localservicefinder.dto.BookingDtos;
import com.localservicefinder.dto.ServiceDtos;
import com.localservicefinder.dto.UserResponseDto;

import java.util.List;

public interface AdminService {
    List<UserResponseDto> users();
    List<UserResponseDto> providers();
    List<ServiceDtos.ServiceResponse> services();
    List<BookingDtos.BookingResponse> bookings();
}