package com.communityapp.modules.communities.service;

import com.communityapp.common.dto.PageResponse;
import com.communityapp.common.exception.ResourceNotFoundException;
import com.communityapp.modules.communities.dto.CommunityResponse;
import com.communityapp.modules.communities.dto.CreateCommunityRequest;
import com.communityapp.modules.communities.dto.UpdateCommunityRequest;
import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.communities.entity.CommunityMember;
import com.communityapp.modules.communities.entity.CommunityMemberRole;
import com.communityapp.modules.communities.entity.CommunityMemberStatus;
import com.communityapp.modules.communities.mapper.CommunityMapper;
import com.communityapp.modules.communities.repository.CommunityMemberRepository;
import com.communityapp.modules.communities.repository.CommunityRepository;
import com.communityapp.modules.users.entity.User;
import com.communityapp.modules.users.entity.UserRole;
import com.communityapp.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserRepository userRepository;
    private final CommunityMapper communityMapper;

    @Transactional(readOnly = true)
    public PageResponse<CommunityResponse> search(String query, Pageable pageable) {
        String safeQuery = query == null ? "" : query.trim();
        Page<Community> communities = safeQuery.isBlank()
                ? communityRepository.findAll(pageable)
                : communityRepository.findByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrStateContainingIgnoreCase(
                safeQuery,
                safeQuery,
                safeQuery,
                pageable
        );

        return PageResponse.from(communities.map(communityMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public CommunityResponse getById(UUID id) {
        return communityMapper.toResponse(findById(id));
    }

    @Transactional(readOnly = true)
    public CommunityResponse getDashboard(UUID id, UUID userId) {
        Community community = findById(id);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAppAdmin = user.getRole() == UserRole.SUPER_ADMIN || user.getRole() == UserRole.COMMUNITY_ADMIN;
        boolean isActiveMember = communityMemberRepository.existsByCommunityAndUserAndStatus(
                community,
                user,
                CommunityMemberStatus.ACTIVE
        );

        if (!isAppAdmin && !isActiveMember) {
            throw new AccessDeniedException("Community access requires approved membership");
        }

        return communityMapper.toResponse(community);
    }

    @Transactional
    public CommunityResponse create(CreateCommunityRequest request, UUID creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Community community = new Community();
        community.setName(request.name());
        community.setDescription(request.description());
        community.setLogoUrl(request.logoUrl());
        community.setCity(request.city());
        community.setState(request.state());
        community.setCreatedBy(creator);

        Community savedCommunity = communityRepository.save(community);

        CommunityMember creatorMembership = new CommunityMember();
        creatorMembership.setCommunity(savedCommunity);
        creatorMembership.setUser(creator);
        creatorMembership.setRoleInCommunity(CommunityMemberRole.ADMIN);
        creatorMembership.setStatus(CommunityMemberStatus.ACTIVE);
        communityMemberRepository.save(creatorMembership);

        return communityMapper.toResponse(savedCommunity);
    }

    @Transactional
    public CommunityResponse update(UUID id, UpdateCommunityRequest request) {
        Community community = findById(id);

        if (request.name() != null) {
            community.setName(request.name());
        }
        if (request.description() != null) {
            community.setDescription(request.description());
        }
        if (request.logoUrl() != null) {
            community.setLogoUrl(request.logoUrl());
        }
        if (request.city() != null) {
            community.setCity(request.city());
        }
        if (request.state() != null) {
            community.setState(request.state());
        }
        if (request.status() != null) {
            community.setStatus(request.status());
        }

        return communityMapper.toResponse(communityRepository.save(community));
    }

    public Community findById(UUID id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
    }
}
