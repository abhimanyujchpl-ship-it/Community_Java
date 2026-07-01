package com.communityapp.modules.dashboard.controller;

import com.communityapp.common.response.ApiResponse;
import com.communityapp.modules.dashboard.dto.AdminDashboardDto;
import com.communityapp.modules.dashboard.dto.MemberDashboardDto;
import com.communityapp.modules.dashboard.service.DashboardService;
import com.communityapp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboards", description = "Admin and member dashboard APIs")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin/{communityId}")
    @Operation(summary = "Get admin dashboard for a community")
    public ApiResponse<AdminDashboardDto> adminDashboard(
            @PathVariable UUID communityId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Admin dashboard retrieved", dashboardService.adminDashboard(communityId, principal.getId()));
    }

    @GetMapping("/member/{communityId}")
    @Operation(summary = "Get member dashboard for a community")
    public ApiResponse<MemberDashboardDto> memberDashboard(
            @PathVariable UUID communityId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Member dashboard retrieved", dashboardService.memberDashboard(communityId, principal.getId()));
    }
}
