package com.communityapp.modules.notifications.service;

import com.communityapp.common.exception.ResourceNotFoundException;
import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.notifications.dto.NotificationResponse;
import com.communityapp.modules.notifications.entity.Notification;
import com.communityapp.modules.notifications.entity.NotificationType;
import com.communityapp.modules.notifications.mapper.NotificationMapper;
import com.communityapp.modules.notifications.repository.NotificationRepository;
import com.communityapp.modules.users.entity.User;
import com.communityapp.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Transactional
    public void create(User user, Community community, NotificationType type, String title, String message, String dataJson) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setCommunity(community);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setDataJson(dataJson);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMine(UUID userId) {
        User user = findUser(userId);

        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long unreadCount(UUID userId) {
        return notificationRepository.countByUserAndIsReadFalse(findUser(userId));
    }

    @Transactional
    public NotificationResponse markRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Notification is not available");
        }

        notification.setRead(true);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllRead(UUID userId) {
        User user = findUser(userId);
        notificationRepository.findByUserOrderByCreatedAtDesc(user).forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    private User findUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
