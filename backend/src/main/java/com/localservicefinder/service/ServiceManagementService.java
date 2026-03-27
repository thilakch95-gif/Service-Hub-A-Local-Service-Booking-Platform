package com.localservicefinder.service;

import com.localservicefinder.dto.ServiceDtos;
import com.localservicefinder.model.ServiceEntity;
import org.springframework.data.domain.Page;

public interface ServiceManagementService {

    ServiceDtos.ServiceResponse create(ServiceDtos.ServiceRequest request, String providerEmail);

    ServiceDtos.ServiceResponse update(Long id, ServiceDtos.ServiceRequest request, String providerEmail);

    void delete(Long id, String providerEmail);

    ServiceDtos.ServiceResponse getById(Long id);

    Page<ServiceDtos.ServiceResponse> list(String category, String location, int page, int size);

    Page<ServiceDtos.ServiceResponse> providerServices(String providerEmail, int page, int size);

    ServiceDtos.ServiceResponse map(ServiceEntity entity);

}