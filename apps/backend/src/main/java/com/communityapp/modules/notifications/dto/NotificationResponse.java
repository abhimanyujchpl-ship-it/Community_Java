package com.communityapp.modules.notifications.dto;

import com.communityapp.modules.notifications.entity.NotificationType;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        UUID communityId,
        NotificationType type,
        String title,
        String message,
        boolean isRead,
        String dataJson,
        Instant createdAt,
        Instant updatedAt
) {
}
