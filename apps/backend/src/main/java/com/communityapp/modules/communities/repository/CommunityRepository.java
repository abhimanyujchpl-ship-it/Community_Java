package com.communityapp.modules.communities.repository;

import com.communityapp.modules.communities.entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommunityRepository extends JpaRepository<Community, UUID> {

    Optional<Community> findByNameIgnoreCase(String name);

    Page<Community> findByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrStateContainingIgnoreCase(
            String name,
            String city,
            String state,
            Pageable pageable
    );

    List<Community> findByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrStateContainingIgnoreCase(
            String name,
            String city,
            String state
    );
}
