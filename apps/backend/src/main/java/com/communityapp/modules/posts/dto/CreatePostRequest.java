package com.communityapp.modules.posts.dto;

import com.communityapp.modules.posts.entity.PostType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreatePostRequest(
        @NotNull UUID communityId,
        @NotNull PostType postType,
        @NotBlank @Size(min = 2, max = 180) String title,
        @NotBlank @Size(min = 2, max = 5000) String content,
        @Size(max = 500) String mediaUrl
) {
}
