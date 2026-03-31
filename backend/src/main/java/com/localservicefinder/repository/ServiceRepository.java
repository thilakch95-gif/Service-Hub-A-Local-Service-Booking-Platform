package com.localservicefinder.repository;

import com.localservicefinder.model.ServiceEntity;
import com.localservicefinder.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {

    @Override
    @EntityGraph(attributePaths = "provider")
    Optional<ServiceEntity> findById(Long id);

    @EntityGraph(attributePaths = "provider")
    Page<ServiceEntity> findByCategoryContainingIgnoreCaseAndLocationContainingIgnoreCase(String category, String location, Pageable pageable);

    @EntityGraph(attributePaths = "provider")
    Page<ServiceEntity> findByProvider(User provider, Pageable pageable);

    @EntityGraph(attributePaths = "provider")
    List<ServiceEntity> findByProvider(User provider);
}
