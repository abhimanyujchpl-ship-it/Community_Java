package com.communityapp.modules.events.dto;

import jakarta.validation.constraints.Size;

import java.time.Instant;

public record UpdateEventRequest(
        @Size(min = 2, max = 180, message = "Event title must be between 2 and 180 characters") String title,
        @Size(max = 120, message = "Event type must be 120 characters or fewer") String eventType,
        @Size(max = 3000, message = "Description must be 3000 characters or fewer") String description,
        @Size(max = 500, message = "Banner URL must be 500 characters or fewer") String bannerUrl,
        @Size(max = 240, message = "Event location must be 240 characters or fewer") String location,
        Instant startDateTime,
        Instant endDateTime,
        @Size(max = 160, message = "Organizer name must be 160 characters or fewer") String organizerName
) {
}
