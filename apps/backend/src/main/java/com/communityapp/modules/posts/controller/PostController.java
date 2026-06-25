package com.communityapp.modules.posts.controller;

import com.communityapp.common.response.ApiResponse;
import com.communityapp.modules.posts.dto.CreatePostRequest;
import com.communityapp.modules.posts.dto.PostResponse;
import com.communityapp.modules.posts.dto.RejectPostRequest;
import com.communityapp.modules.posts.dto.UpdatePostRequest;
import com.communityapp.modules.posts.service.PostService;
import com.communityapp.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ApiResponse<PostResponse> create(
            @Valid @RequestBody CreatePostRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Post submitted for approval", postService.create(request, principal.getId()));
    }

    @GetMapping("/feed/{communityId}")
    public ApiResponse<List<PostResponse>> feed(@PathVariable UUID communityId) {
        return ApiResponse.ok("Community feed retrieved", postService.feed(communityId));
    }

    @GetMapping("/my")
    public ApiResponse<List<PostResponse>> myPosts(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("My posts retrieved", postService.myPosts(principal.getId()));
    }

    @GetMapping("/pending/{communityId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<List<PostResponse>> pending(
            @PathVariable UUID communityId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Pending posts retrieved", postService.pending(communityId, principal.getId()));
    }

    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getById(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Post retrieved", postService.getById(id, principal.getId()));
    }

    @PatchMapping("/{id}")
    public ApiResponse<PostResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePostRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Post updated", postService.update(id, request, principal.getId()));
    }

    @PatchMapping("/{id}/submit")
    public ApiResponse<PostResponse> submit(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Post submitted for approval", postService.submit(id, principal.getId()));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<PostResponse> approve(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Post approved", postService.approve(id, principal.getId()));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<PostResponse> reject(
            @PathVariable UUID id,
            @Valid @RequestBody RejectPostRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Post rejected", postService.reject(id, request, principal.getId()));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        postService.delete(id, principal.getId());
        return ApiResponse.ok("Post deleted", null);
    }
}
