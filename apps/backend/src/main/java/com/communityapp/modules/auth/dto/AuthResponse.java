package com.communityapp.modules.auth.dto;

import com.communityapp.modules.users.dto.UserResponse;

import java.time.Instant;

public record AuthResponse(
        String accessToken,
        String tokenType,
        Instant expiresAt,
        UserResponse user
) {
}
