package com.communityapp.modules.accessrequests.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateAccessRequest(
        @NotNull UUID communityId,
        @Size(max = 500) String requestMessage
) {
}
