package com.communityapp.modules.communities.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommunityRequest(
        @NotBlank(message = "Community name is required") @Size(min = 2, max = 150, message = "Community name must be between 2 and 150 characters") String name,
        @Size(max = 1000, message = "Description must be 1000 characters or fewer") String description,
        @Size(max = 500, message = "Logo URL must be 500 characters or fewer") String logoUrl,
        @Size(max = 120, message = "City must be 120 characters or fewer") String city,
        @Size(max = 120, message = "State must be 120 characters or fewer") String state
) {
}
