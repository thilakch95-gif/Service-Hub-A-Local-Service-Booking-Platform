package com.localservicefinder.repository;

import com.localservicefinder.model.ServiceEntity;
import com.localservicefinder.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    Page<ServiceEntity> findByCategoryContainingIgnoreCaseAndLocationContainingIgnoreCase(String category, String location, Pageable pageable);
    Page<ServiceEntity> findByProvider(User provider, Pageable pageable);
    List<ServiceEntity> findByProvider(User provider);
}
