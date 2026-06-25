package com.communityapp.modules.accessrequests.mapper;

import com.communityapp.modules.accessrequests.dto.AccessRequestResponse;
import com.communityapp.modules.accessrequests.entity.AccessRequest;
import com.communityapp.modules.communities.mapper.CommunityMapper;
import com.communityapp.modules.users.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AccessRequestMapper {

    private final CommunityMapper communityMapper;
    private final UserMapper userMapper;

    public AccessRequestResponse toResponse(AccessRequest accessRequest) {
        return new AccessRequestResponse(
                accessRequest.getId(),
                communityMapper.toResponse(accessRequest.getCommunity()),
                userMapper.toResponse(accessRequest.getUser()),
                accessRequest.getStatus(),
                accessRequest.getRequestMessage(),
                accessRequest.getRejectionReason(),
                accessRequest.getReviewedBy() != null ? userMapper.toResponse(accessRequest.getReviewedBy()) : null,
                accessRequest.getReviewedAt(),
                accessRequest.getCreatedAt(),
                accessRequest.getUpdatedAt()
        );
    }
}
