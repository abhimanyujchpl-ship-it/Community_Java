package com.communityapp.modules.events.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public record CreateEventRequest(
        @NotNull UUID communityId,
        @NotBlank @Size(min = 2, max = 180) String title,
        @NotBlank @Size(max = 120) String eventType,
        @Size(max = 3000) String description,
        @Size(max = 500) String bannerUrl,
        @NotBlank @Size(max = 240) String location,
        @NotNull Instant startDateTime,
        @NotNull Instant endDateTime,
        @Size(max = 160) String organizerName
) {
}
