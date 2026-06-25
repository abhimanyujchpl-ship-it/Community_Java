package com.communityapp.modules.communities.controller;

import com.communityapp.common.response.ApiResponse;
import com.communityapp.modules.communities.dto.CommunityResponse;
import com.communityapp.modules.communities.dto.CreateCommunityRequest;
import com.communityapp.modules.communities.dto.UpdateCommunityRequest;
import com.communityapp.modules.communities.service.CommunityService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/communities")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping
    public ApiResponse<List<CommunityResponse>> search(@RequestParam(defaultValue = "") String query) {
        return ApiResponse.ok("Communities retrieved", communityService.search(query));
    }

    @GetMapping("/{id}")
    public ApiResponse<CommunityResponse> getById(@PathVariable UUID id) {
        return ApiResponse.ok("Community retrieved", communityService.getById(id));
    }

    @GetMapping("/{id}/dashboard")
    public ApiResponse<CommunityResponse> dashboard(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Community dashboard retrieved", communityService.getDashboard(id, principal.getId()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<CommunityResponse> create(
            @Valid @RequestBody CreateCommunityRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Community created", communityService.create(request, principal.getId()));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<CommunityResponse> update(@PathVariable UUID id, @Valid @RequestBody UpdateCommunityRequest request) {
        return ApiResponse.ok("Community updated", communityService.update(id, request));
    }
}
