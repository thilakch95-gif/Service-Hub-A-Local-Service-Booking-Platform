package com.localservicefinder.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* SERVICE RELATION */

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_id")
    @JsonIgnoreProperties({"provider","hibernateLazyInitializer","handler"})
    private ServiceEntity service;

    /* USER RELATION */

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password","hibernateLazyInitializer","handler"})
    private User user;

    @Column(nullable = false)
    private LocalDate serviceDate;

    @Column(nullable = false, length = 1000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    private LocalDateTime createdAt;

    /* PROVIDER EARNING (NEW FIELD ADDED) */

    @Column(name = "provider_earning")
    private Double providerEarning;

    public Booking() {
    }

    public Booking(Long id, ServiceEntity service, User user,
                   LocalDate serviceDate, String notes,
                   BookingStatus status, LocalDateTime createdAt) {

        this.id = id;
        this.service = service;
        this.user = user;
        this.serviceDate = serviceDate;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ServiceEntity getService() {
        return service;
    }

    public void setService(ServiceEntity service) {
        this.service = service;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /* GETTER + SETTER FOR PROVIDER EARNING */

    public Double getProviderEarning() {
        return providerEarning;
    }

    public void setProviderEarning(Double providerEarning) {
        this.providerEarning = providerEarning;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = BookingStatus.PENDING;
        }
    }
}