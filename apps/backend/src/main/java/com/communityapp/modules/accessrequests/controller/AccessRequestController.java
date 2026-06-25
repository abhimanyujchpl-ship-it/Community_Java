package com.communityapp.modules.accessrequests.controller;

import com.communityapp.common.response.ApiResponse;
import com.communityapp.modules.accessrequests.dto.AccessRequestResponse;
import com.communityapp.modules.accessrequests.dto.CreateAccessRequest;
import com.communityapp.modules.accessrequests.dto.RejectAccessRequest;
import com.communityapp.modules.accessrequests.service.AccessRequestService;
import com.communityapp.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/access-requests")
@RequiredArgsConstructor
public class AccessRequestController {

    private final AccessRequestService accessRequestService;

    @PostMapping
    public ApiResponse<AccessRequestResponse> create(
            @Valid @RequestBody CreateAccessRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Access request submitted", accessRequestService.create(request, principal.getId()));
    }

    @GetMapping("/my")
    public ApiResponse<List<AccessRequestResponse>> myRequests(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Access requests retrieved", accessRequestService.getMyRequests(principal.getId()));
    }

    @GetMapping("/community/{communityId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<List<AccessRequestResponse>> communityRequests(@PathVariable UUID communityId) {
        return ApiResponse.ok("Community access requests retrieved", accessRequestService.getCommunityRequests(communityId));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<AccessRequestResponse> approve(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Access request approved", accessRequestService.approve(id, principal.getId()));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<AccessRequestResponse> reject(
            @PathVariable UUID id,
            @Valid @RequestBody RejectAccessRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Access request rejected", accessRequestService.reject(id, request, principal.getId()));
    }
}
