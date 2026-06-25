package com.communityapp.modules.events.dto;

import com.communityapp.modules.communities.dto.CommunityResponse;
import com.communityapp.modules.events.entity.EventStatus;
import com.communityapp.modules.users.dto.UserResponse;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record EventResponse(
        UUID id,
        CommunityResponse community,
        String title,
        String eventType,
        String description,
        String bannerUrl,
        String location,
        Instant startDateTime,
        Instant endDateTime,
        String organizerName,
        EventStatus status,
        UserResponse createdBy,
        List<EventReminderResponse> reminders,
        Instant createdAt,
        Instant updatedAt
) {
}
