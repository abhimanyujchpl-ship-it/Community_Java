package com.communityapp.modules.events.mapper;

import com.communityapp.modules.communities.mapper.CommunityMapper;
import com.communityapp.modules.events.dto.EventReminderResponse;
import com.communityapp.modules.events.dto.EventResponse;
import com.communityapp.modules.events.entity.Event;
import com.communityapp.modules.events.entity.EventReminder;
import com.communityapp.modules.events.repository.EventReminderRepository;
import com.communityapp.modules.users.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EventMapper {

    private final CommunityMapper communityMapper;
    private final UserMapper userMapper;
    private final EventReminderRepository eventReminderRepository;

    public EventResponse toResponse(Event event) {
        List<EventReminderResponse> reminders = eventReminderRepository.findByEventOrderByReminderDateTimeAsc(event)
                .stream()
                .map(this::toReminderResponse)
                .toList();

        return new EventResponse(
                event.getId(),
                communityMapper.toResponse(event.getCommunity()),
                event.getTitle(),
                event.getEventType(),
                event.getDescription(),
                event.getBannerUrl(),
                event.getLocation(),
                event.getStartDateTime(),
                event.getEndDateTime(),
                event.getOrganizerName(),
                event.getStatus(),
                userMapper.toResponse(event.getCreatedBy()),
                reminders,
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }

    public EventReminderResponse toReminderResponse(EventReminder reminder) {
        return new EventReminderResponse(
                reminder.getId(),
                reminder.getReminderType(),
                reminder.getReminderDateTime(),
                reminder.getMessage(),
                reminder.isSent(),
                reminder.getCreatedAt(),
                reminder.getUpdatedAt()
        );
    }
}
