package com.communityapp.config;

import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.communities.entity.CommunityMember;
import com.communityapp.modules.communities.entity.CommunityMemberRole;
import com.communityapp.modules.communities.entity.CommunityMemberStatus;
import com.communityapp.modules.communities.repository.CommunityMemberRepository;
import com.communityapp.modules.communities.repository.CommunityRepository;
import com.communityapp.modules.users.entity.User;
import com.communityapp.modules.users.entity.UserRole;
import com.communityapp.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.sample-password}")
    private String samplePassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        User superAdmin = upsertUser("superadmin@community.test", "9000000001", "Sample Super Admin", UserRole.SUPER_ADMIN);
        User communityAdmin = upsertUser("admin@community.test", "9000000002", "Sample Community Admin", UserRole.COMMUNITY_ADMIN);
        User member = upsertUser("member@community.test", "9000000003", "Sample Member", UserRole.MEMBER);

        Community community = communityRepository.findByNameIgnoreCase("Greenwood Heights")
                .orElseGet(() -> {
                    Community created = new Community();
                    created.setName("Greenwood Heights");
                    created.setDescription("Sample residential community for end-to-end testing.");
                    created.setCity("Bengaluru");
                    created.setState("Karnataka");
                    created.setCreatedBy(superAdmin);
                    return communityRepository.save(created);
                });

        ensureMembership(community, communityAdmin, CommunityMemberRole.ADMIN);
        ensureMembership(community, member, CommunityMemberRole.MEMBER);
    }

    private User upsertUser(String email, String mobile, String fullName, UserRole role) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User user = new User();
                    user.setEmail(email);
                    user.setMobile(mobile);
                    user.setFullName(fullName);
                    user.setRole(role);
                    user.setCity("Bengaluru");
                    user.setState("Karnataka");
                    user.setPasswordHash(passwordEncoder.encode(samplePassword));
                    return userRepository.save(user);
                });
    }

    private void ensureMembership(Community community, User user, CommunityMemberRole role) {
        communityMemberRepository.findByCommunityAndUser(community, user)
                .ifPresentOrElse(member -> {
                    member.setStatus(CommunityMemberStatus.ACTIVE);
                    member.setRoleInCommunity(role);
                    communityMemberRepository.save(member);
                }, () -> {
                    CommunityMember member = new CommunityMember();
                    member.setCommunity(community);
                    member.setUser(user);
                    member.setRoleInCommunity(role);
                    member.setStatus(CommunityMemberStatus.ACTIVE);
                    communityMemberRepository.save(member);
                });
    }
}
