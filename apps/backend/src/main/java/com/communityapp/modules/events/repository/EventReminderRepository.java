package com.communityapp.modules.events.repository;

import com.communityapp.modules.events.entity.Event;
import com.communityapp.modules.events.entity.EventReminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventReminderRepository extends JpaRepository<EventReminder, UUID> {

    List<EventReminder> findByEventOrderByReminderDateTimeAsc(Event event);
}
