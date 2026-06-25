package com.communityapp.modules.events.dto;

import com.communityapp.modules.events.entity.ReminderType;

import java.time.Instant;
import java.util.UUID;

public record EventReminderResponse(
        UUID id,
        ReminderType reminderType,
        Instant reminderDateTime,
        String message,
        boolean isSent,
        Instant createdAt,
        Instant updatedAt
) {
}
