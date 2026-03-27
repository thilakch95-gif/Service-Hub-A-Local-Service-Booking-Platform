package com.localservicefinder.dto;

import java.time.LocalDateTime;

public class RatingResponse {

    private Long id;
    private int stars;
    private String comment;
    private String userName;
    private LocalDateTime createdAt;

    public RatingResponse(Long id, int stars, String comment, String userName, LocalDateTime createdAt) {
        this.id = id;
        this.stars = stars;
        this.comment = comment;
        this.userName = userName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public int getStars() {
        return stars;
    }

    public String getComment() {
        return comment;
    }

    public String getUserName() {
        return userName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}