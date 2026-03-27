package com.localservicefinder.dto;

public class ProviderDashboardStatsDTO {

    private long totalBookings;
    private long completedServices;
    private double averageRating;
    private double totalEarnings;

    public ProviderDashboardStatsDTO() {
    }

    public ProviderDashboardStatsDTO(long totalBookings, long completedServices, double averageRating, double totalEarnings) {
        this.totalBookings = totalBookings;
        this.completedServices = completedServices;
        this.averageRating = averageRating;
        this.totalEarnings = totalEarnings;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getCompletedServices() {
        return completedServices;
    }

    public void setCompletedServices(long completedServices) {
        this.completedServices = completedServices;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public double getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }
}