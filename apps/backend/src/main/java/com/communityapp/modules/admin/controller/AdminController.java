package com.communityapp.modules.admin.controller;

import com.communityapp.common.response.ApiResponse;
import com.communityapp.modules.admin.dto.AdminDashboardDto;
import com.communityapp.modules.admin.service.AdminService;
import com.communityapp.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('COMMUNITY_ADMIN', 'SUPER_ADMIN')")
    public ApiResponse<Map<String, String>> dashboard() {
        return ApiResponse.ok("Admin dashboard placeholder", Map.of("status", "ready"));
    }

    @GetMapping("/dashboard/{communityId}")
    public ApiResponse<AdminDashboardDto> communityDashboard(
            @PathVariable UUID communityId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Admin dashboard retrieved", adminService.adminDashboard(communityId, principal.getId()));
    }
}
