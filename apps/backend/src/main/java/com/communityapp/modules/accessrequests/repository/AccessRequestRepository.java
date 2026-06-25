package com.communityapp.modules.accessrequests.repository;

import com.communityapp.modules.accessrequests.entity.AccessRequest;
import com.communityapp.modules.accessrequests.entity.AccessRequestStatus;
import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccessRequestRepository extends JpaRepository<AccessRequest, UUID> {

    List<AccessRequest> findByUserOrderByCreatedAtDesc(User user);

    List<AccessRequest> findByCommunityOrderByCreatedAtDesc(Community community);

    List<AccessRequest> findTop5ByCommunityAndStatusOrderByCreatedAtDesc(Community community, AccessRequestStatus status);

    long countByCommunityAndStatus(Community community, AccessRequestStatus status);

    Optional<AccessRequest> findByCommunityAndUserAndStatus(Community community, User user, AccessRequestStatus status);

    boolean existsByCommunityAndUserAndStatus(Community community, User user, AccessRequestStatus status);
}
