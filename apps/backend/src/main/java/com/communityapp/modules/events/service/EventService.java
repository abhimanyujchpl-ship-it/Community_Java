package com.communityapp.modules.events.service;

import com.communityapp.common.exception.BadRequestException;
import com.communityapp.common.exception.ResourceNotFoundException;
import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.communities.entity.CommunityMemberStatus;
import com.communityapp.modules.communities.repository.CommunityMemberRepository;
import com.communityapp.modules.communities.repository.CommunityRepository;
import com.communityapp.modules.events.dto.CreateEventReminderRequest;
import com.communityapp.modules.events.dto.CreateEventRequest;
import com.communityapp.modules.events.dto.EventResponse;
import com.communityapp.modules.events.dto.UpdateEventRequest;
import com.communityapp.modules.events.entity.Event;
import com.communityapp.modules.events.entity.EventReminder;
import com.communityapp.modules.events.entity.EventStatus;
import com.communityapp.modules.events.mapper.EventMapper;
import com.communityapp.modules.events.repository.EventReminderRepository;
import com.communityapp.modules.events.repository.EventRepository;
import com.communityapp.modules.notifications.service.NotificationService;
import com.communityapp.modules.notifications.entity.NotificationType;
import com.communityapp.modules.users.entity.User;
import com.communityapp.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventReminderRepository eventReminderRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserRepository userRepository;
    private final EventMapper eventMapper;
    private final NotificationService notificationService;

    @Transactional
    public EventResponse create(CreateEventRequest request, UUID creatorId) {
        validateDateRange(request.startDateTime(), request.endDateTime());
        Community community = findCommunity(request.communityId());
        User creator = findUser(creatorId);

        Event event = new Event();
        event.setCommunity(community);
        event.setTitle(request.title());
        event.setEventType(request.eventType());
        event.setDescription(request.description());
        event.setBannerUrl(request.bannerUrl());
        event.setLocation(request.location());
        event.setStartDateTime(request.startDateTime());
        event.setEndDateTime(request.endDateTime());
        event.setOrganizerName(request.organizerName());
        event.setCreatedBy(creator);
        event.setStatus(EventStatus.UPCOMING);

        Event saved = eventRepository.save(event);
        notifyActiveMembers(community, "New event: " + saved.getTitle(), "An event has been scheduled in " + community.getName(), saved.getId());

        return eventMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> byCommunity(UUID communityId) {
        Community community = findCommunity(communityId);

        return eventRepository.findByCommunityOrderByStartDateTimeAsc(community).stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EventResponse> upcoming(UUID communityId) {
        Community community = findCommunity(communityId);

        return eventRepository.findByCommunityAndStatusOrderByStartDateTimeAsc(community, EventStatus.UPCOMING).stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getById(UUID id) {
        return eventMapper.toResponse(findEvent(id));
    }

    @Transactional
    public EventResponse update(UUID id, UpdateEventRequest request) {
        Event event = findEvent(id);
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BadRequestException("Cancelled events cannot be edited");
        }

        java.time.Instant nextStart = request.startDateTime() != null ? request.startDateTime() : event.getStartDateTime();
        java.time.Instant nextEnd = request.endDateTime() != null ? request.endDateTime() : event.getEndDateTime();
        validateDateRange(nextStart, nextEnd);

        if (request.title() != null) {
            event.setTitle(request.title());
        }
        if (request.eventType() != null) {
            event.setEventType(request.eventType());
        }
        if (request.description() != null) {
            event.setDescription(request.description());
        }
        if (request.bannerUrl() != null) {
            event.setBannerUrl(request.bannerUrl());
        }
        if (request.location() != null) {
            event.setLocation(request.location());
        }
        if (request.startDateTime() != null) {
            event.setStartDateTime(request.startDateTime());
        }
        if (request.endDateTime() != null) {
            event.setEndDateTime(request.endDateTime());
        }
        if (request.organizerName() != null) {
            event.setOrganizerName(request.organizerName());
        }

        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse cancel(UUID id) {
        Event event = findEvent(id);
        event.setStatus(EventStatus.CANCELLED);
        Event saved = eventRepository.save(event);
        return eventMapper.toResponse(saved);
    }

    @Transactional
    public EventResponse complete(UUID id) {
        Event event = findEvent(id);
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BadRequestException("Cancelled events cannot be completed");
        }
        event.setStatus(EventStatus.COMPLETED);
        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse addReminder(UUID eventId, CreateEventReminderRequest request) {
        Event event = findEvent(eventId);
        EventReminder reminder = new EventReminder();
        reminder.setEvent(event);
        reminder.setReminderType(request.reminderType());
        reminder.setReminderDateTime(request.reminderDateTime());
        reminder.setMessage(request.message());
        reminder.setSent(false);
        eventReminderRepository.save(reminder);
        return eventMapper.toResponse(event);
    }

    private void validateDateRange(java.time.Instant startDateTime, java.time.Instant endDateTime) {
        if (endDateTime.isBefore(startDateTime)) {
            throw new BadRequestException("End date cannot be before start date");
        }
    }

    private void notifyActiveMembers(Community community, String title, String body, UUID eventId) {
        communityMemberRepository.findByCommunityAndStatus(community, CommunityMemberStatus.ACTIVE)
                .forEach(member -> notificationService.create(
                        member.getUser(),
                        community,
                        NotificationType.NEW_EVENT,
                        title,
                        body,
                        "{\"eventId\":\"" + eventId + "\",\"communityId\":\"" + community.getId() + "\"}"
                ));
    }

    private Event findEvent(UUID id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
    }

    private Community findCommunity(UUID id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
    }

    private User findUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
