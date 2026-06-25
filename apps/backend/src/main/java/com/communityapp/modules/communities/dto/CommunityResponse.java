package com.communityapp.modules.communities.dto;

import com.communityapp.modules.communities.entity.CommunityStatus;

import java.time.Instant;
import java.util.UUID;

public record CommunityResponse(
        UUID id,
        String name,
        String description,
        String logoUrl,
        String city,
        String state,
        CommunityStatus status,
        UUID createdById,
        long memberCount,
        Instant createdAt,
        Instant updatedAt
) {
}
