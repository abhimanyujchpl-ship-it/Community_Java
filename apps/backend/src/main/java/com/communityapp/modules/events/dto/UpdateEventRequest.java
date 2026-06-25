package com.communityapp.modules.events.dto;

import jakarta.validation.constraints.Size;

import java.time.Instant;

public record UpdateEventRequest(
        @Size(min = 2, max = 180) String title,
        @Size(max = 120) String eventType,
        @Size(max = 3000) String description,
        @Size(max = 500) String bannerUrl,
        @Size(max = 240) String location,
        Instant startDateTime,
        Instant endDateTime,
        @Size(max = 160) String organizerName
) {
}
