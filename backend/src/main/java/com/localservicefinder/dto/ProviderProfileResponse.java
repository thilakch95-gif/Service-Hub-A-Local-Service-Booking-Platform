package com.localservicefinder.dto;

public class ProviderProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String bio;
    private String profileImage;

    public ProviderProfileResponse(Long id, String fullName, String email,
                                   String phone, String bio, String profileImage) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.bio = bio;
        this.profileImage = profileImage;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getBio() { return bio; }
    public String getProfileImage() { return profileImage; }
}