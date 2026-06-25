package com.communityapp.modules.events.repository;

import com.communityapp.modules.events.entity.Event;
import com.communityapp.modules.events.entity.EventStatus;
import com.communityapp.modules.communities.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {

    List<Event> findByCommunityOrderByStartDateTimeAsc(Community community);

    List<Event> findByCommunityAndStatusOrderByStartDateTimeAsc(Community community, EventStatus status);

    List<Event> findTop5ByCommunityAndStatusOrderByStartDateTimeAsc(Community community, EventStatus status);

    long countByCommunityAndStatus(Community community, EventStatus status);
}
