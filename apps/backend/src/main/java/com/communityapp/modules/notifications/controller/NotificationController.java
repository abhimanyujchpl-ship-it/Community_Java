package com.communityapp.modules.notifications.controller;

import com.communityapp.common.response.ApiResponse;
import com.communityapp.modules.notifications.dto.NotificationResponse;
import com.communityapp.modules.notifications.service.NotificationService;
import com.communityapp.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<NotificationResponse>> getMine(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Notifications retrieved", notificationService.getMine(principal.getId()));
    }

    @GetMapping("/unread-count")
    public ApiResponse<Map<String, Long>> unreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Unread notification count retrieved", Map.of("count", notificationService.unreadCount(principal.getId())));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<NotificationResponse> markRead(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Notification marked read", notificationService.markRead(id, principal.getId()));
    }

    @PatchMapping("/read-all")
    public ApiResponse<Void> markAllRead(@AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAllRead(principal.getId());
        return ApiResponse.ok("Notifications marked read", null);
    }
}
