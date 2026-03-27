package com.localservicefinder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "ratings",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "bookingId")
    }
)
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long bookingId;

    @Column(nullable = false)
    private Long providerId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int stars;

    @Column(length = 1000)
    private String comment;

    private LocalDateTime createdAt;

    public Rating() {}

    public Rating(Long bookingId, Long providerId, Long userId, int stars, String comment) {
        this.bookingId = bookingId;
        this.providerId = providerId;
        this.userId = userId;
        this.stars = stars;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Long getProviderId() {
        return providerId;
    }

    public Long getUserId() {
        return userId;
    }

    public int getStars() {
        return stars;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}