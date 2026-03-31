package com.localservicefinder.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryImageService {

    private final Cloudinary cloudinary;

    public CloudinaryImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadProfileImage(MultipartFile file) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        Object secureUrl = uploadResult.get("secure_url");

        if (secureUrl == null) {
            throw new IOException("Cloudinary did not return a secure URL");
        }

        String imageUrl = secureUrl.toString();

        if (!imageUrl.startsWith("https://res.cloudinary.com/")) {
            throw new IOException("Cloudinary returned an unexpected secure URL");
        }

        System.out.println("Cloudinary URL: " + imageUrl);

        return imageUrl;
    }
}
