package com.communityapp.modules.events.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public record CreateEventRequest(
        @NotNull(message = "Community ID is required") UUID communityId,
        @NotBlank(message = "Event title is required") @Size(min = 2, max = 180, message = "Event title must be between 2 and 180 characters") String title,
        @NotBlank(message = "Event type is required") @Size(max = 120, message = "Event type must be 120 characters or fewer") String eventType,
        @Size(max = 3000, message = "Description must be 3000 characters or fewer") String description,
        @Size(max = 500, message = "Banner URL must be 500 characters or fewer") String bannerUrl,
        @NotBlank(message = "Event location is required") @Size(max = 240, message = "Event location must be 240 characters or fewer") String location,
        @NotNull(message = "Start date and time is required") @FutureOrPresent(message = "Start date and time cannot be in the past") Instant startDateTime,
        @NotNull(message = "End date and time is required") @FutureOrPresent(message = "End date and time cannot be in the past") Instant endDateTime,
        @Size(max = 160, message = "Organizer name must be 160 characters or fewer") String organizerName
) {
}
