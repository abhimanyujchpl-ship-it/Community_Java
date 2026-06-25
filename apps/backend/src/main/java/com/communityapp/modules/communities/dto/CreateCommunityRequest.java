package com.communityapp.modules.communities.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommunityRequest(
        @NotBlank @Size(min = 2, max = 150) String name,
        @Size(max = 1000) String description,
        @Size(max = 500) String logoUrl,
        @NotBlank @Size(max = 120) String city,
        @NotBlank @Size(max = 120) String state
) {
}
