package com.communityapp.modules.auth.controller;

import com.communityapp.common.response.ApiResponse;
import com.communityapp.modules.auth.dto.AuthResponse;
import com.communityapp.modules.auth.dto.LoginRequest;
import com.communityapp.modules.auth.dto.RegisterRequest;
import com.communityapp.modules.auth.service.AuthService;
import com.communityapp.modules.users.dto.UserResponse;
import com.communityapp.modules.users.service.UserService;
import com.communityapp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication and current user APIs")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register user")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok("Registered successfully", authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email/mobile and password")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok("Logged in successfully", authService.login(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user")
    public ApiResponse<UserResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Current user", userService.getById(principal.getId()));
    }
}
