package com.communityapp.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 120) String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 20) String mobile,
        @NotBlank @Size(min = 8, max = 120) String password,
        String gender,
        @Past LocalDate dateOfBirth,
        @Size(max = 500) String address,
        @Size(max = 120) String city,
        @Size(max = 120) String state,
        @Size(max = 120) String occupation,
        @Size(max = 500) String profilePhotoUrl
) {
}
