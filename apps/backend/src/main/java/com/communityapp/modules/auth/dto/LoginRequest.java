package com.communityapp.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Email or mobile number is required") String emailOrMobile,
        @NotBlank(message = "Password is required") @Size(min = 8, message = "Password must be at least 8 characters") String password
) {
}
