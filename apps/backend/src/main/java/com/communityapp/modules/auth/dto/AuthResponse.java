package com.communityapp.modules.auth.dto;

import com.communityapp.modules.users.dto.UserResponse;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

public record AuthResponse(
        String accessToken,
        String tokenType,
        Instant expiresAt,
        UserResponse user
) {
    @JsonProperty("token")
    public String token() {
        return accessToken;
    }
}
