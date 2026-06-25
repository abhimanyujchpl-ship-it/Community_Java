package com.communityapp.modules.notifications.mapper;

import com.communityapp.modules.notifications.dto.NotificationResponse;
import com.communityapp.modules.notifications.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getCommunity() != null ? notification.getCommunity().getId() : null,
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.isRead(),
                notification.getDataJson(),
                notification.getCreatedAt(),
                notification.getUpdatedAt()
        );
    }
}
