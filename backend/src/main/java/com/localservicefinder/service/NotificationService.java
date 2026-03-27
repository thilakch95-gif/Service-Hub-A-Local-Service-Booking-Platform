package com.localservicefinder.service;

import com.localservicefinder.model.Notification;
import java.util.List;

public interface NotificationService {

    List<Notification> getUserNotifications(String email);

    long getUnreadCount(String email);

    void createNotification(Long userId, String message);

    void markAsRead(Long notificationId);

}