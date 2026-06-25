package com.communityapp.modules.posts.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejectPostRequest(
        @NotBlank @Size(max = 500) String rejectionReason
) {
}
