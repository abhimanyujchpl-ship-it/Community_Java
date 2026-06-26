package com.communityapp.modules.dashboard.dto;

import com.communityapp.modules.communities.dto.CommunityResponse;
import com.communityapp.modules.events.dto.EventResponse;
import com.communityapp.modules.notifications.dto.NotificationResponse;
import com.communityapp.modules.posts.dto.PostResponse;

import java.util.List;

public record MemberDashboardDto(
        CommunityResponse community,
        List<PostResponse> feedPreview,
        List<EventResponse> upcomingEvents,
        List<EventResponse> calendarReminders,
        List<PostResponse> announcements,
        List<PostResponse> myPostsStatus,
        long notificationsCount,
        List<NotificationResponse> notifications
) {
}
