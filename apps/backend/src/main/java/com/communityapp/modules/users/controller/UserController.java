package com.communityapp.modules.users.controller;

import com.communityapp.common.dto.PageResponse;
import com.communityapp.common.response.ApiResponse;
import com.communityapp.common.util.PageableFactory;
import com.communityapp.modules.users.dto.UpdateUserRequest;
import com.communityapp.modules.users.dto.UserResponse;
import com.communityapp.modules.users.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile and admin user APIs")
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "List users with search and pagination")
    public ApiResponse<PageResponse<UserResponse>> getAll(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.ok(
                "Users retrieved",
                userService.getAll(query, PageableFactory.create(page, size, Sort.by("createdAt").descending()))
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN') or #id.toString() == authentication.name")
    @Operation(summary = "Get user by UUID")
    public ApiResponse<UserResponse> getById(@PathVariable UUID id) {
        return ApiResponse.ok("User retrieved", userService.getById(id));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN') or #id.toString() == authentication.name")
    @Operation(summary = "Update user profile")
    public ApiResponse<UserResponse> update(@PathVariable UUID id, @Valid @RequestBody UpdateUserRequest request) {
        return ApiResponse.ok("User updated", userService.update(id, request));
    }
}
