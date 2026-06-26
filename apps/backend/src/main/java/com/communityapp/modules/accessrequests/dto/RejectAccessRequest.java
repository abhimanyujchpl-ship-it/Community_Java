package com.communityapp.modules.accessrequests.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejectAccessRequest(
        @NotBlank(message = "Rejection reason is required") @Size(max = 500, message = "Rejection reason must be 500 characters or fewer") String rejectionReason
) {
}
