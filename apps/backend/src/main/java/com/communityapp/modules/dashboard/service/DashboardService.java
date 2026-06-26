package com.communityapp.modules.dashboard.service;

import com.communityapp.common.exception.ResourceNotFoundException;
import com.communityapp.modules.accessrequests.entity.AccessRequestStatus;
import com.communityapp.modules.accessrequests.mapper.AccessRequestMapper;
import com.communityapp.modules.accessrequests.repository.AccessRequestRepository;
import com.communityapp.modules.dashboard.dto.AdminDashboardDto;
import com.communityapp.modules.dashboard.dto.MemberDashboardDto;
import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.communities.entity.CommunityMemberRole;
import com.communityapp.modules.communities.entity.CommunityMemberStatus;
import com.communityapp.modules.communities.mapper.CommunityMapper;
import com.communityapp.modules.communities.repository.CommunityMemberRepository;
import com.communityapp.modules.communities.repository.CommunityRepository;
import com.communityapp.modules.events.entity.EventStatus;
import com.communityapp.modules.events.mapper.EventMapper;
import com.communityapp.modules.events.repository.EventRepository;
import com.communityapp.modules.notifications.mapper.NotificationMapper;
import com.communityapp.modules.notifications.repository.NotificationRepository;
import com.communityapp.modules.posts.entity.PostStatus;
import com.communityapp.modules.posts.entity.PostType;
import com.communityapp.modules.posts.mapper.PostMapper;
import com.communityapp.modules.posts.repository.PostRepository;
import com.communityapp.modules.users.entity.User;
import com.communityapp.modules.users.entity.UserRole;
import com.communityapp.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final AccessRequestRepository accessRequestRepository;
    private final PostRepository postRepository;
    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final CommunityMapper communityMapper;
    private final AccessRequestMapper accessRequestMapper;
    private final PostMapper postMapper;
    private final EventMapper eventMapper;
    private final NotificationMapper notificationMapper;

    @Transactional(readOnly = true)
    public AdminDashboardDto adminDashboard(UUID communityId, UUID userId) {
        Community community = findCommunity(communityId);
        User user = findUser(userId);
        ensureCommunityAdmin(community, user);

        return new AdminDashboardDto(
                communityMemberRepository.countByCommunityAndStatus(community, CommunityMemberStatus.ACTIVE),
                accessRequestRepository.countByCommunityAndStatus(community, AccessRequestStatus.PENDING),
                postRepository.countByCommunityAndStatus(community, PostStatus.PENDING_APPROVAL),
                eventRepository.countByCommunityAndStatus(community, EventStatus.UPCOMING),
                postRepository.countByCommunityAndStatus(community, PostStatus.APPROVED),
                notificationRepository.countByUserAndCommunityAndIsReadFalse(user, community),
                communityMemberRepository.countByCommunityAndStatus(community, CommunityMemberStatus.BLOCKED),
                communityMapper.toResponse(community),
                accessRequestRepository.findTop5ByCommunityAndStatusOrderByCreatedAtDesc(community, AccessRequestStatus.PENDING)
                        .stream()
                        .map(accessRequestMapper::toResponse)
                        .toList(),
                postRepository.findTop5ByCommunityAndStatusOrderByCreatedAtDesc(community, PostStatus.PENDING_APPROVAL)
                        .stream()
                        .map(postMapper::toResponse)
                        .toList(),
                eventRepository.findTop5ByCommunityAndStatusOrderByStartDateTimeAsc(community, EventStatus.UPCOMING)
                        .stream()
                        .map(eventMapper::toResponse)
                        .toList(),
                postRepository.findTop5ByCommunityAndStatusOrderByCreatedAtDesc(community, PostStatus.APPROVED)
                        .stream()
                        .map(postMapper::toResponse)
                        .toList()
        );
    }

    @Transactional(readOnly = true)
    public MemberDashboardDto memberDashboard(UUID communityId, UUID userId) {
        Community community = findCommunity(communityId);
        User user = findUser(userId);
        ensureApprovedMember(community, user);

        return new MemberDashboardDto(
                communityMapper.toResponse(community),
                postRepository.findTop5ByCommunityAndStatusOrderByCreatedAtDesc(community, PostStatus.APPROVED)
                        .stream()
                        .map(postMapper::toResponse)
                        .toList(),
                eventRepository.findTop5ByCommunityAndStatusOrderByStartDateTimeAsc(community, EventStatus.UPCOMING)
                        .stream()
                        .map(eventMapper::toResponse)
                        .toList(),
                eventRepository.findTop5ByCommunityAndStatusOrderByStartDateTimeAsc(community, EventStatus.UPCOMING)
                        .stream()
                        .map(eventMapper::toResponse)
                        .filter(event -> !event.reminders().isEmpty())
                        .toList(),
                postRepository.findTop5ByCommunityAndStatusAndPostTypeOrderByCreatedAtDesc(
                                community,
                                PostStatus.APPROVED,
                                PostType.ANNOUNCEMENT
                        )
                        .stream()
                        .map(postMapper::toResponse)
                        .toList(),
                postRepository.findTop5ByCommunityAndAuthorAndStatusNotOrderByCreatedAtDesc(community, user, PostStatus.DELETED)
                        .stream()
                        .map(postMapper::toResponse)
                        .toList(),
                notificationRepository.countByUserAndCommunityAndIsReadFalse(user, community),
                notificationRepository.findTop5ByUserAndCommunityOrderByCreatedAtDesc(user, community)
                        .stream()
                        .map(notificationMapper::toResponse)
                        .toList()
        );
    }

    private void ensureCommunityAdmin(Community community, User user) {
        boolean isSuperAdmin = user.getRole() == UserRole.SUPER_ADMIN;
        boolean isCommunityAdmin = communityMemberRepository.existsByCommunityAndUserAndRoleInCommunityAndStatus(
                community,
                user,
                CommunityMemberRole.ADMIN,
                CommunityMemberStatus.ACTIVE
        );

        if (!isSuperAdmin && !isCommunityAdmin) {
            throw new AccessDeniedException("Community admin access is required");
        }
    }

    private void ensureApprovedMember(Community community, User user) {
        boolean isActiveMember = communityMemberRepository.existsByCommunityAndUserAndStatus(
                community,
                user,
                CommunityMemberStatus.ACTIVE
        );

        if (!isActiveMember) {
            throw new AccessDeniedException("Approved community membership is required");
        }
    }

    private Community findCommunity(UUID id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
    }

    private User findUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
