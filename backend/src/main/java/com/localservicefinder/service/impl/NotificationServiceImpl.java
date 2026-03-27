package com.localservicefinder.service.impl;

import com.localservicefinder.model.Notification;
import com.localservicefinder.model.User;
import com.localservicefinder.repository.NotificationRepository;
import com.localservicefinder.repository.UserRepository;
import com.localservicefinder.service.NotificationService;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   UserRepository userRepository,
                                   SimpMessagingTemplate messagingTemplate) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;

    }

    /* GET USER NOTIFICATIONS */

    @Override
    public List<Notification> getUserNotifications(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    /* GET UNREAD COUNT */

    @Override
    public long getUnreadCount(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    /* CREATE NOTIFICATION */

    @Override
    public void createNotification(Long userId, String message) {

        Notification notification = new Notification(userId, message);

        Notification saved = notificationRepository.save(notification);

        /* REAL-TIME PUSH USING WEBSOCKET */

        messagingTemplate.convertAndSend(
                "/topic/notifications/" + userId,
                saved
        );
    }
    public void markAsRead(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);

        notificationRepository.save(notification);
    }

}