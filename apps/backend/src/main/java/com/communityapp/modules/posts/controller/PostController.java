package com.communityapp.modules.posts.controller;

import com.communityapp.common.dto.PageResponse;
import com.communityapp.common.response.ApiResponse;
import com.communityapp.common.util.PageableFactory;
import com.communityapp.modules.posts.dto.CreatePostRequest;
import com.communityapp.modules.posts.dto.PostResponse;
import com.communityapp.modules.posts.dto.RejectPostRequest;
import com.communityapp.modules.posts.dto.UpdatePostRequest;
import com.communityapp.modules.posts.entity.PostType;
import com.communityapp.modules.posts.service.PostService;
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
@RequestMapping("/posts")
@RequiredArgsConstructor
@Tag(name = "Posts", description = "Community feed and moderation APIs")
public class PostController {

    private final PostService postService;

    @PostMapping
    @Operation(summary = "Create post for approval")
    public ApiResponse<PostResponse> create(
            @Valid @RequestBody CreatePostRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Post submitted for approval", postService.create(request, principal.getId()));
    }

    @GetMapping("/feed/{communityId}")
    @Operation(summary = "List approved feed posts with pagination and optional post type filter")
    public ApiResponse<PageResponse<PostResponse>> feed(
            @PathVariable UUID communityId,
            @RequestParam(required = false) PostType postType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok(
                "Community feed retrieved",
                postService.feed(communityId, postType, principal.getId(), PageableFactory.create(page, size, Sort.by("createdAt").descending()))
        );
    }

    @GetMapping("/my")
    @Operation(summary = "List current user's posts with pagination")
    public ApiResponse<PageResponse<PostResponse>> myPosts(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.ok(
                "My posts retrieved",
                postService.myPosts(principal.getId(), PageableFactory.create(page, size, Sort.by("createdAt").descending()))
        );
    }

    @GetMapping("/pending/{communityId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "List pending post approvals")
    public ApiResponse<PageResponse<PostResponse>> pending(
            @PathVariable UUID communityId,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.ok(
                "Pending posts retrieved",
                postService.pending(communityId, principal.getId(), PageableFactory.create(page, size, Sort.by("createdAt").descending()))
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get post by UUID")
    public ApiResponse<PostResponse> getById(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Post retrieved", postService.getById(id, principal.getId()));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update own unapproved post")
    public ApiResponse<PostResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePostRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Post updated", postService.update(id, request, principal.getId()));
    }

    @PatchMapping("/{id}/submit")
    @Operation(summary = "Submit own post for review")
    public ApiResponse<PostResponse> submit(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Post submitted for approval", postService.submit(id, principal.getId()));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Approve pending post")
    public ApiResponse<PostResponse> approve(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Post approved", postService.approve(id, principal.getId()));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Reject pending post")
    public ApiResponse<PostResponse> reject(
            @PathVariable UUID id,
            @Valid @RequestBody RejectPostRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Post rejected", postService.reject(id, request, principal.getId()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft-delete post")
    public ApiResponse<Void> delete(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        postService.delete(id, principal.getId());
        return ApiResponse.ok("Post deleted", null);
    }
}
