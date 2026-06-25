package com.communityapp.modules.posts.dto;

import com.communityapp.modules.communities.dto.CommunityResponse;
import com.communityapp.modules.posts.entity.PostStatus;
import com.communityapp.modules.posts.entity.PostType;
import com.communityapp.modules.users.dto.UserResponse;

import java.time.Instant;
import java.util.UUID;

public record PostResponse(
        UUID id,
        CommunityResponse community,
        UserResponse author,
        PostType postType,
        String title,
        String content,
        String mediaUrl,
        PostStatus status,
        String rejectionReason,
        UserResponse approvedBy,
        Instant approvedAt,
        Instant createdAt,
        Instant updatedAt
) {
}
