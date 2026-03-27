package com.localservicefinder.dto;

import com.localservicefinder.model.BookingStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDtos {

    public static class BookingRequest {

        @NotNull
        private Long serviceId;

        @NotNull
        @FutureOrPresent
        private LocalDate serviceDate;

        @NotBlank
        private String notes;

        public Long getServiceId() {
            return serviceId;
        }

        public void setServiceId(Long serviceId) {
            this.serviceId = serviceId;
        }

        public LocalDate getServiceDate() {
            return serviceDate;
        }

        public void setServiceDate(LocalDate serviceDate) {
            this.serviceDate = serviceDate;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }

    public static class BookingStatusRequest {

        @NotNull
        private BookingStatus status;

        public BookingStatus getStatus() {
            return status;
        }

        public void setStatus(BookingStatus status) {
            this.status = status;
        }
    }

    public static class BookingResponse {

        private Long id;
        private Long serviceId;
        private String serviceTitle;
        private Long userId;
        private String userName;
        private BookingStatus status;
        private LocalDate serviceDate;
        private String notes;
        private LocalDateTime createdAt;
        private BigDecimal price;

        public BookingResponse() {
        }

        public BookingResponse(Long id, Long serviceId, String serviceTitle, Long userId,
                               String userName, BookingStatus status, LocalDate serviceDate,
                               String notes, LocalDateTime createdAt) {
            this.id = id;
            this.serviceId = serviceId;
            this.serviceTitle = serviceTitle;
            this.userId = userId;
            this.userName = userName;
            this.status = status;
            this.serviceDate = serviceDate;
            this.notes = notes;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getServiceId() {
            return serviceId;
        }

        public void setServiceId(Long serviceId) {
            this.serviceId = serviceId;
        }

        public String getServiceTitle() {
            return serviceTitle;
        }

        public void setServiceTitle(String serviceTitle) {
            this.serviceTitle = serviceTitle;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public BookingStatus getStatus() {
            return status;
        }

        public void setStatus(BookingStatus status) {
            this.status = status;
        }

        public LocalDate getServiceDate() {
            return serviceDate;
        }

        public void setServiceDate(LocalDate serviceDate) {
            this.serviceDate = serviceDate;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }
    }
}