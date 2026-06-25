package com.communityapp.modules.users.dto;

import com.communityapp.modules.users.entity.UserRole;
import com.communityapp.modules.users.entity.UserStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String fullName,
        String email,
        String mobile,
        String gender,
        LocalDate dateOfBirth,
        String address,
        String city,
        String state,
        String occupation,
        String profilePhotoUrl,
        UserRole role,
        UserStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
