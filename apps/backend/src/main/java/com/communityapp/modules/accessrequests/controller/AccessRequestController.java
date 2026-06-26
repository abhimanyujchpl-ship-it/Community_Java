package com.communityapp.modules.accessrequests.controller;

import com.communityapp.common.dto.PageResponse;
import com.communityapp.common.response.ApiResponse;
import com.communityapp.common.util.PageableFactory;
import com.communityapp.modules.accessrequests.dto.AccessRequestResponse;
import com.communityapp.modules.accessrequests.dto.CreateAccessRequest;
import com.communityapp.modules.accessrequests.dto.RejectAccessRequest;
import com.communityapp.modules.accessrequests.entity.AccessRequestStatus;
import com.communityapp.modules.accessrequests.service.AccessRequestService;
import com.communityapp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/access-requests")
@RequiredArgsConstructor
@Tag(name = "Access Requests", description = "Community join request APIs")
public class AccessRequestController {

    private final AccessRequestService accessRequestService;

    @PostMapping
    @Operation(summary = "Submit community access request")
    public ApiResponse<AccessRequestResponse> create(
            @Valid @RequestBody CreateAccessRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Access request submitted", accessRequestService.create(request, principal.getId()));
    }

    @GetMapping("/my")
    @Operation(summary = "List current user's access requests")
    public ApiResponse<PageResponse<AccessRequestResponse>> myRequests(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.ok(
                "Access requests retrieved",
                accessRequestService.getMyRequests(principal.getId(), PageableFactory.create(page, size, Sort.by("createdAt").descending()))
        );
    }

    @GetMapping("/community/{communityId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "List community access requests with optional status filter")
    public ApiResponse<PageResponse<AccessRequestResponse>> communityRequests(
            @PathVariable UUID communityId,
            @RequestParam(required = false) AccessRequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok(
                "Community access requests retrieved",
                accessRequestService.getCommunityRequests(communityId, status, principal.getId(), PageableFactory.create(page, size, Sort.by("createdAt").descending()))
        );
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Approve access request")
    public ApiResponse<AccessRequestResponse> approve(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Access request approved", accessRequestService.approve(id, principal.getId()));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Reject access request")
    public ApiResponse<AccessRequestResponse> reject(
            @PathVariable UUID id,
            @Valid @RequestBody RejectAccessRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Access request rejected", accessRequestService.reject(id, request, principal.getId()));
    }
}
