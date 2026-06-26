package com.communityapp.modules.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateUserRequest(
        @Size(min = 2, max = 120, message = "Full name must be between 2 and 120 characters") String fullName,
        @Email(message = "Email must be valid") String email,
        @Pattern(regexp = "^[0-9]{8,15}$", message = "Mobile number must contain 8 to 15 digits") String mobile,
        String gender,
        @Past(message = "Date of birth must be in the past") LocalDate dateOfBirth,
        @Size(max = 500, message = "Address must be 500 characters or fewer") String address,
        @Size(max = 120, message = "City must be 120 characters or fewer") String city,
        @Size(max = 120, message = "State must be 120 characters or fewer") String state,
        @Size(max = 120, message = "Occupation must be 120 characters or fewer") String occupation,
        @Size(max = 500, message = "Profile photo URL must be 500 characters or fewer") String profilePhotoUrl
) {
}
