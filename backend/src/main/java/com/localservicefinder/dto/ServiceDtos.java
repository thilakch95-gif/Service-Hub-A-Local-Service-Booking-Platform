package com.localservicefinder.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceDtos {

    public static class ServiceRequest {

        @NotBlank
        private String title;

        @NotBlank
        private String description;

        @NotBlank
        private String category;

        @NotNull
        @DecimalMin("0.0")
        private BigDecimal price;

        @NotBlank
        private String location;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }
    }

    public static class ServiceResponse {

        private Long id;
        private String title;
        private String description;
        private String category;
        private BigDecimal price;
        private String location;
        private Long providerId;
        private String providerName;
        private LocalDateTime createdAt;

        public ServiceResponse() {
        }

        public ServiceResponse(Long id, String title, String description, String category,
                               BigDecimal price, String location, Long providerId,
                               String providerName, LocalDateTime createdAt) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.category = category;
            this.price = price;
            this.location = location;
            this.providerId = providerId;
            this.providerName = providerName;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public Long getProviderId() {
            return providerId;
        }

        public void setProviderId(Long providerId) {
            this.providerId = providerId;
        }

        public String getProviderName() {
            return providerName;
        }

        public void setProviderName(String providerName) {
            this.providerName = providerName;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
}