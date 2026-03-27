package com.localservicefinder.repository;

import com.localservicefinder.model.User;
import com.localservicefinder.model.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    /* ================= BASIC AUTH ================= */

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    /* ================= PROVIDER QUERIES ================= */

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'PROVIDER'")
    long countProviders();

    @Query("SELECT u FROM User u WHERE u.role = 'PROVIDER'")
    List<User> findProviders();

    /* ================= USER QUERIES ================= */

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'USER'")
    long countUsers();

    /* ================= ROLE BASED SEARCH ================= */

    List<User> findByRole(Role role);

    /* ================= ADMIN DASHBOARD STATS ================= */

    @Query("SELECT COUNT(u) FROM User u")
    long countAllUsers();

}