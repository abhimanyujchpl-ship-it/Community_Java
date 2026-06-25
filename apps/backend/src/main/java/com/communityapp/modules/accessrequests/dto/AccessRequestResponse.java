package com.communityapp.modules.accessrequests.dto;

import com.communityapp.modules.accessrequests.entity.AccessRequestStatus;
import com.communityapp.modules.communities.dto.CommunityResponse;
import com.communityapp.modules.users.dto.UserResponse;

import java.time.Instant;
import java.util.UUID;

public record AccessRequestResponse(
        UUID id,
        CommunityResponse community,
        UserResponse user,
        AccessRequestStatus status,
        String requestMessage,
        String rejectionReason,
        UserResponse reviewedBy,
        Instant reviewedAt,
        Instant createdAt,
        Instant updatedAt
) {
}
