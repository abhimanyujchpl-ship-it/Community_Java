package com.communityapp.modules.events.dto;

import com.communityapp.modules.events.entity.ReminderType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record CreateEventReminderRequest(
        @NotNull(message = "Reminder type is required") ReminderType reminderType,
        @NotNull(message = "Reminder date and time is required") @FutureOrPresent(message = "Reminder date and time cannot be in the past") Instant reminderDateTime,
        @NotBlank(message = "Reminder message is required") @Size(max = 1000, message = "Reminder message must be 1000 characters or fewer") String message
) {
}
