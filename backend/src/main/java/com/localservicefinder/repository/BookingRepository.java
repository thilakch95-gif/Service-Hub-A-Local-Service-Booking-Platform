package com.localservicefinder.repository;

import com.localservicefinder.model.Booking;
import com.localservicefinder.model.BookingStatus;
import com.localservicefinder.model.ServiceEntity;
import com.localservicefinder.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    /* =====================================================
                       USER BOOKINGS
       ===================================================== */

    List<Booking> findByUser(User user);

    long countByUser(User user);

    long countByUserAndStatus(User user, BookingStatus status);



    /* =====================================================
                     PROVIDER BOOKINGS
       ===================================================== */

    List<Booking> findByServiceProvider(User provider);

    long countByServiceProvider(User provider);

    long countByServiceProviderAndStatus(User provider, BookingStatus status);



    /* =====================================================
                      SERVICE BOOKINGS
       ===================================================== */

    List<Booking> findByService(ServiceEntity service);



    /* =====================================================
                     ADMIN DASHBOARD
       ===================================================== */

    long countByStatus(BookingStatus status);



    /* =====================================================
                  GLOBAL PLATFORM STATS
       ===================================================== */

    long count(); // total bookings



    /* =====================================================
                 PROVIDER DASHBOARD STATS
       ===================================================== */

    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.service.provider.id = :providerId
    """)
    long countProviderBookings(@Param("providerId") Long providerId);


    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.service.provider.id = :providerId
        AND b.status = 'COMPLETED'
    """)
    long countCompletedServices(@Param("providerId") Long providerId);


    @Query("""
        SELECT SUM(b.providerEarning)
        FROM Booking b
        WHERE b.service.provider.id = :providerId
        AND b.status = 'COMPLETED'
    """)
    Double getTotalProviderEarnings(@Param("providerId") Long providerId);
    /* =====================================================
    PROVIDER ANALYTICS - CATEGORY PERFORMANCE
===================================================== */

@Query("""
SELECT b.service.category, COUNT(b)
FROM Booking b
WHERE b.service.provider.id = :providerId
GROUP BY b.service.category
""")
List<Object[]> getCategoryPerformance(Long providerId);



/* =====================================================
    PROVIDER ANALYTICS - MONTHLY EARNINGS
===================================================== */

@Query("""
SELECT FUNCTION('MONTH', b.serviceDate), SUM(b.providerEarning)
FROM Booking b
WHERE b.service.provider.id = :providerId
AND b.status = 'COMPLETED'
GROUP BY FUNCTION('MONTH', b.serviceDate)
ORDER BY FUNCTION('MONTH', b.serviceDate)
""")
List<Object[]> getMonthlyEarnings(Long providerId);



/* =====================================================
    PROVIDER ANALYTICS - JOB STATUS
===================================================== */

@Query("""
SELECT b.status, COUNT(b)
FROM Booking b
WHERE b.service.provider.id = :providerId
GROUP BY b.status
""")
List<Object[]> getJobStatusDistribution(Long providerId);



/* =====================================================
    PROVIDER ANALYTICS - TOP SERVICES
===================================================== */

@Query("""
SELECT b.service.title, COUNT(b)
FROM Booking b
WHERE b.service.provider.id = :providerId
GROUP BY b.service.title
ORDER BY COUNT(b) DESC
""")
List<Object[]> getTopServices(Long providerId);

}