package com.communityapp.modules.accessrequests.service;

import com.communityapp.common.exception.DuplicateResourceException;
import com.communityapp.common.exception.ResourceNotFoundException;
import com.communityapp.modules.accessrequests.dto.AccessRequestResponse;
import com.communityapp.modules.accessrequests.dto.CreateAccessRequest;
import com.communityapp.modules.accessrequests.dto.RejectAccessRequest;
import com.communityapp.modules.accessrequests.entity.AccessRequest;
import com.communityapp.modules.accessrequests.entity.AccessRequestStatus;
import com.communityapp.modules.accessrequests.mapper.AccessRequestMapper;
import com.communityapp.modules.accessrequests.repository.AccessRequestRepository;
import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.communities.entity.CommunityMember;
import com.communityapp.modules.communities.entity.CommunityMemberRole;
import com.communityapp.modules.communities.entity.CommunityMemberStatus;
import com.communityapp.modules.communities.repository.CommunityMemberRepository;
import com.communityapp.modules.communities.repository.CommunityRepository;
import com.communityapp.modules.notifications.entity.NotificationType;
import com.communityapp.modules.notifications.service.NotificationService;
import com.communityapp.modules.users.entity.User;
import com.communityapp.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccessRequestService {

    private final AccessRequestRepository accessRequestRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserRepository userRepository;
    private final AccessRequestMapper accessRequestMapper;
    private final NotificationService notificationService;

    @Transactional
    public AccessRequestResponse create(CreateAccessRequest request, UUID userId) {
        Community community = findCommunity(request.communityId());
        User user = findUser(userId);

        if (communityMemberRepository.existsByCommunityAndUserAndStatus(community, user, CommunityMemberStatus.ACTIVE)) {
            throw new DuplicateResourceException("User is already an active community member");
        }

        if (accessRequestRepository.existsByCommunityAndUserAndStatus(community, user, AccessRequestStatus.PENDING)) {
            throw new DuplicateResourceException("A pending access request already exists for this community");
        }

        AccessRequest accessRequest = new AccessRequest();
        accessRequest.setCommunity(community);
        accessRequest.setUser(user);
        accessRequest.setRequestMessage(request.requestMessage());
        accessRequest.setStatus(AccessRequestStatus.PENDING);

        return accessRequestMapper.toResponse(accessRequestRepository.save(accessRequest));
    }

    @Transactional(readOnly = true)
    public List<AccessRequestResponse> getMyRequests(UUID userId) {
        User user = findUser(userId);

        return accessRequestRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(accessRequestMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AccessRequestResponse> getCommunityRequests(UUID communityId) {
        Community community = findCommunity(communityId);

        return accessRequestRepository.findByCommunityOrderByCreatedAtDesc(community).stream()
                .map(accessRequestMapper::toResponse)
                .toList();
    }

    @Transactional
    public AccessRequestResponse approve(UUID requestId, UUID reviewerId) {
        AccessRequest accessRequest = findAccessRequest(requestId);
        User reviewer = findUser(reviewerId);

        ensurePending(accessRequest);
        accessRequest.setStatus(AccessRequestStatus.APPROVED);
        accessRequest.setReviewedBy(reviewer);
        accessRequest.setReviewedAt(Instant.now());
        accessRequest.setRejectionReason(null);

        communityMemberRepository.findByCommunityAndUser(accessRequest.getCommunity(), accessRequest.getUser())
                .ifPresentOrElse(member -> {
                    member.setStatus(CommunityMemberStatus.ACTIVE);
                    member.setRoleInCommunity(CommunityMemberRole.MEMBER);
                    member.setJoinedAt(Instant.now());
                    communityMemberRepository.save(member);
                }, () -> {
                    CommunityMember member = new CommunityMember();
                    member.setCommunity(accessRequest.getCommunity());
                    member.setUser(accessRequest.getUser());
                    member.setRoleInCommunity(CommunityMemberRole.MEMBER);
                    member.setStatus(CommunityMemberStatus.ACTIVE);
                    member.setJoinedAt(Instant.now());
                    communityMemberRepository.save(member);
        });

        AccessRequest saved = accessRequestRepository.save(accessRequest);
        notificationService.create(
                saved.getUser(),
                saved.getCommunity(),
                NotificationType.ACCESS_REQUEST_APPROVED,
                "Access request approved",
                "Your request to join " + saved.getCommunity().getName() + " was approved.",
                "{\"communityId\":\"" + saved.getCommunity().getId() + "\",\"accessRequestId\":\"" + saved.getId() + "\"}"
        );
        return accessRequestMapper.toResponse(saved);
    }

    @Transactional
    public AccessRequestResponse reject(UUID requestId, RejectAccessRequest request, UUID reviewerId) {
        AccessRequest accessRequest = findAccessRequest(requestId);
        User reviewer = findUser(reviewerId);

        ensurePending(accessRequest);
        accessRequest.setStatus(AccessRequestStatus.REJECTED);
        accessRequest.setReviewedBy(reviewer);
        accessRequest.setReviewedAt(Instant.now());
        accessRequest.setRejectionReason(request.rejectionReason());

        AccessRequest saved = accessRequestRepository.save(accessRequest);
        notificationService.create(
                saved.getUser(),
                saved.getCommunity(),
                NotificationType.ACCESS_REQUEST_REJECTED,
                "Access request rejected",
                "Your request to join " + saved.getCommunity().getName() + " was rejected.",
                "{\"communityId\":\"" + saved.getCommunity().getId() + "\",\"accessRequestId\":\"" + saved.getId() + "\"}"
        );
        return accessRequestMapper.toResponse(saved);
    }

    private void ensurePending(AccessRequest accessRequest) {
        if (accessRequest.getStatus() != AccessRequestStatus.PENDING) {
            throw new DuplicateResourceException("Only pending access requests can be reviewed");
        }
    }

    private AccessRequest findAccessRequest(UUID id) {
        return accessRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Access request not found"));
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
