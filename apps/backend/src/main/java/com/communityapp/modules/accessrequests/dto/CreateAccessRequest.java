package com.communityapp.modules.accessrequests.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateAccessRequest(
        @NotNull(message = "Community ID is required") UUID communityId,
        @Size(max = 500, message = "Request message must be 500 characters or fewer") String requestMessage
) {
}
