package com.communityapp.modules.accessrequests.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejectAccessRequest(
        @NotBlank @Size(max = 500) String rejectionReason
) {
}
