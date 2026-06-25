package com.communityapp.modules.communities.repository;

import com.communityapp.modules.communities.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommunityRepository extends JpaRepository<Community, UUID> {

    List<Community> findByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrStateContainingIgnoreCase(
            String name,
            String city,
            String state
    );
}
