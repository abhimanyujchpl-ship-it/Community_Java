package com.communityapp.modules.communities.mapper;

import com.communityapp.modules.communities.dto.CommunityResponse;
import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.communities.entity.CommunityMemberStatus;
import com.communityapp.modules.communities.repository.CommunityMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommunityMapper {

    private final CommunityMemberRepository communityMemberRepository;

    public CommunityResponse toResponse(Community community) {
        long memberCount = communityMemberRepository.countByCommunityAndStatus(community, CommunityMemberStatus.ACTIVE);

        return new CommunityResponse(
                community.getId(),
                community.getName(),
                community.getDescription(),
                community.getLogoUrl(),
                community.getCity(),
                community.getState(),
                community.getStatus(),
                community.getCreatedBy() != null ? community.getCreatedBy().getId() : null,
                memberCount,
                community.getCreatedAt(),
                community.getUpdatedAt()
        );
    }
}
