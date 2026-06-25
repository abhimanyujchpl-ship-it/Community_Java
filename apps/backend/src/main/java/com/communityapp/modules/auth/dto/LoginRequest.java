package com.communityapp.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank String emailOrMobile,
        @NotBlank @Size(min = 8) String password
) {
}
