package com.communityapp.modules.admin.controller;

import com.communityapp.common.response.ApiResponse;
import com.communityapp.modules.admin.dto.AdminDashboardDto;
import com.communityapp.modules.admin.dto.MemberDashboardDto;
import com.communityapp.modules.admin.service.AdminService;
import com.communityapp.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardApiController {

    private final AdminService adminService;

    @GetMapping("/admin/dashboard/{communityId}")
    public ApiResponse<AdminDashboardDto> adminDashboard(
            @PathVariable UUID communityId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Admin dashboard retrieved", adminService.adminDashboard(communityId, principal.getId()));
    }

    @GetMapping("/member/dashboard/{communityId}")
    public ApiResponse<MemberDashboardDto> memberDashboard(
            @PathVariable UUID communityId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Member dashboard retrieved", adminService.memberDashboard(communityId, principal.getId()));
    }
}
