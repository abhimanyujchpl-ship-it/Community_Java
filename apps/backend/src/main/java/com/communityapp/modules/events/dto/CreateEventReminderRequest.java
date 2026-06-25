package com.communityapp.modules.events.dto;

import com.communityapp.modules.events.entity.ReminderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record CreateEventReminderRequest(
        @NotNull ReminderType reminderType,
        @NotNull Instant reminderDateTime,
        @NotBlank @Size(max = 1000) String message
) {
}
