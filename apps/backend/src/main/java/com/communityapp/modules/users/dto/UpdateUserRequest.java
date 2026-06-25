package com.communityapp.modules.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateUserRequest(
        @Size(min = 2, max = 120) String fullName,
        @Email String email,
        @Size(min = 8, max = 20) String mobile,
        String gender,
        @Past LocalDate dateOfBirth,
        @Size(max = 500) String address,
        @Size(max = 120) String city,
        @Size(max = 120) String state,
        @Size(max = 120) String occupation,
        @Size(max = 500) String profilePhotoUrl
) {
}
