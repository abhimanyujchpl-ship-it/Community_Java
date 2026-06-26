package com.communityapp.modules.posts.dto;

import com.communityapp.modules.posts.entity.PostType;
import jakarta.validation.constraints.Size;

public record UpdatePostRequest(
        PostType postType,
        @Size(min = 2, max = 180, message = "Post title must be between 2 and 180 characters") String title,
        @Size(min = 2, max = 5000, message = "Post content must be between 2 and 5000 characters") String content,
        @Size(max = 500, message = "Media URL must be 500 characters or fewer") String mediaUrl
) {
}
