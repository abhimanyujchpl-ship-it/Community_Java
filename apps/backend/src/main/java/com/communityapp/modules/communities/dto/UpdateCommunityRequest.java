package com.communityapp.modules.communities.dto;

import com.communityapp.modules.communities.entity.CommunityStatus;
import jakarta.validation.constraints.Size;

public record UpdateCommunityRequest(
        @Size(min = 2, max = 150) String name,
        @Size(max = 1000) String description,
        @Size(max = 500) String logoUrl,
        @Size(max = 120) String city,
        @Size(max = 120) String state,
        CommunityStatus status
) {
}
