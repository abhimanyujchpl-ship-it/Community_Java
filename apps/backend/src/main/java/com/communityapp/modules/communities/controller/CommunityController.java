package com.communityapp.modules.communities.controller;

import com.communityapp.common.dto.PageResponse;
import com.communityapp.common.response.ApiResponse;
import com.communityapp.common.util.PageableFactory;
import com.communityapp.modules.communities.dto.CommunityResponse;
import com.communityapp.modules.communities.dto.CreateCommunityRequest;
import com.communityapp.modules.communities.dto.UpdateCommunityRequest;
import com.communityapp.modules.communities.service.CommunityService;
import com.communityapp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
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

import java.util.UUID;

@RestController
@RequestMapping("/communities")
@RequiredArgsConstructor
@Tag(name = "Communities", description = "Community discovery and management APIs")
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping
    @Operation(summary = "Search communities")
    public ApiResponse<PageResponse<CommunityResponse>> search(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.ok(
                "Communities retrieved",
                communityService.search(query, PageableFactory.create(page, size, Sort.by("createdAt").descending()))
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get community by UUID")
    public ApiResponse<CommunityResponse> getById(@PathVariable UUID id) {
        return ApiResponse.ok("Community retrieved", communityService.getById(id));
    }

    @GetMapping("/{id}/dashboard")
    @Operation(summary = "Get community summary dashboard")
    public ApiResponse<CommunityResponse> dashboard(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Community dashboard retrieved", communityService.getDashboard(id, principal.getId()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Create community")
    public ApiResponse<CommunityResponse> create(
            @Valid @RequestBody CreateCommunityRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Community created", communityService.create(request, principal.getId()));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Update community")
    public ApiResponse<CommunityResponse> update(@PathVariable UUID id, @Valid @RequestBody UpdateCommunityRequest request) {
        return ApiResponse.ok("Community updated", communityService.update(id, request));
    }
}
