package com.communityapp.modules.communities.repository;

import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.communities.entity.CommunityMember;
import com.communityapp.modules.communities.entity.CommunityMemberRole;
import com.communityapp.modules.communities.entity.CommunityMemberStatus;
import com.communityapp.modules.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommunityMemberRepository extends JpaRepository<CommunityMember, UUID> {

    long countByCommunityAndStatus(Community community, CommunityMemberStatus status);

    boolean existsByCommunityAndUserAndStatus(Community community, User user, CommunityMemberStatus status);

    boolean existsByCommunityAndUserAndRoleInCommunityAndStatus(
            Community community,
            User user,
            CommunityMemberRole roleInCommunity,
            CommunityMemberStatus status
    );

    Optional<CommunityMember> findByCommunityAndUser(Community community, User user);

    List<CommunityMember> findByCommunityAndStatus(Community community, CommunityMemberStatus status);
}
