package com.communityapp.modules.admin.dto;

import com.communityapp.modules.accessrequests.dto.AccessRequestResponse;
import com.communityapp.modules.communities.dto.CommunityResponse;
import com.communityapp.modules.events.dto.EventResponse;
import com.communityapp.modules.posts.dto.PostResponse;

import java.util.List;

public record AdminDashboardDto(
        long totalMembers,
        long pendingAccessRequests,
        long pendingPostApprovals,
        long upcomingEvents,
        long recentPostsCount,
        long notificationsCount,
        long blockedUsers,
        CommunityResponse community,
        List<AccessRequestResponse> pendingRequests,
        List<PostResponse> pendingPosts,
        List<EventResponse> upcomingEventPreview,
        List<PostResponse> recentPosts
) {
}
