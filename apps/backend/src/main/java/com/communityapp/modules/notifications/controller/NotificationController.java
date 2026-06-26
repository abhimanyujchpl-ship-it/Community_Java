package com.communityapp.modules.notifications.controller;

import com.communityapp.common.dto.PageResponse;
import com.communityapp.common.response.ApiResponse;
import com.communityapp.common.util.PageableFactory;
import com.communityapp.modules.notifications.dto.NotificationResponse;
import com.communityapp.modules.notifications.service.NotificationService;
import com.communityapp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "User notification APIs")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "List current user's notifications")
    public ApiResponse<PageResponse<NotificationResponse>> getMine(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.ok(
                "Notifications retrieved",
                notificationService.getMine(principal.getId(), isRead, PageableFactory.create(page, size, Sort.by("createdAt").descending()))
        );
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count")
    public ApiResponse<Map<String, Long>> unreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Unread notification count retrieved", Map.of("count", notificationService.unreadCount(principal.getId())));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ApiResponse<NotificationResponse> markRead(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Notification marked read", notificationService.markRead(id, principal.getId()));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all current user's notifications as read")
    public ApiResponse<Void> markAllRead(@AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAllRead(principal.getId());
        return ApiResponse.ok("Notifications marked read", null);
    }
}
