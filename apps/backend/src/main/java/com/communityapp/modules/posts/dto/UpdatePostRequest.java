package com.communityapp.modules.posts.dto;

import com.communityapp.modules.posts.entity.PostType;
import jakarta.validation.constraints.Size;

public record UpdatePostRequest(
        PostType postType,
        @Size(min = 2, max = 180) String title,
        @Size(min = 2, max = 5000) String content,
        @Size(max = 500) String mediaUrl
) {
}
