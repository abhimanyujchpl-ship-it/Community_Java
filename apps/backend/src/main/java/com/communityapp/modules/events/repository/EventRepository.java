package com.communityapp.modules.events.repository;

import com.communityapp.modules.events.entity.Event;
import com.communityapp.modules.events.entity.EventStatus;
import com.communityapp.modules.communities.entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {

    List<Event> findByCommunityOrderByStartDateTimeAsc(Community community);

    Page<Event> findByCommunityOrderByStartDateTimeAsc(Community community, Pageable pageable);

    List<Event> findByCommunityAndStatusOrderByStartDateTimeAsc(Community community, EventStatus status);

    Page<Event> findByCommunityAndStatusOrderByStartDateTimeAsc(Community community, EventStatus status, Pageable pageable);

    List<Event> findTop5ByCommunityAndStatusOrderByStartDateTimeAsc(Community community, EventStatus status);

    long countByCommunityAndStatus(Community community, EventStatus status);
}
