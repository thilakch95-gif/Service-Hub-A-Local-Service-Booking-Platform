package com.localservicefinder.controller;

import com.localservicefinder.model.Notification;
import com.localservicefinder.service.NotificationService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/me")
    public List<Notification> myNotifications(Authentication auth) {

        return notificationService.getUserNotifications(auth.getName());

    }

    @GetMapping("/me/unread")
    public long unreadCount(Authentication auth) {

        return notificationService.getUnreadCount(auth.getName());

    }
    @PutMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {

        notificationService.markAsRead(id);

    }

}