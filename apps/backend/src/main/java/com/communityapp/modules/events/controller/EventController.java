package com.communityapp.modules.events.controller;

import com.communityapp.common.response.ApiResponse;
import com.communityapp.modules.events.dto.CreateEventReminderRequest;
import com.communityapp.modules.events.dto.CreateEventRequest;
import com.communityapp.modules.events.dto.EventResponse;
import com.communityapp.modules.events.dto.UpdateEventRequest;
import com.communityapp.modules.events.service.EventService;
import com.communityapp.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<EventResponse> create(
            @Valid @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Event created", eventService.create(request, principal.getId()));
    }

    @GetMapping("/community/{communityId}")
    public ApiResponse<List<EventResponse>> byCommunity(@PathVariable UUID communityId) {
        return ApiResponse.ok("Events retrieved", eventService.byCommunity(communityId));
    }

    @GetMapping("/upcoming/{communityId}")
    public ApiResponse<List<EventResponse>> upcoming(@PathVariable UUID communityId) {
        return ApiResponse.ok("Upcoming events retrieved", eventService.upcoming(communityId));
    }

    @GetMapping("/{id}")
    public ApiResponse<EventResponse> getById(@PathVariable UUID id) {
        return ApiResponse.ok("Event retrieved", eventService.getById(id));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<EventResponse> update(@PathVariable UUID id, @Valid @RequestBody UpdateEventRequest request) {
        return ApiResponse.ok("Event updated", eventService.update(id, request));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<EventResponse> cancel(@PathVariable UUID id) {
        return ApiResponse.ok("Event cancelled", eventService.cancel(id));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    public ApiResponse<EventResponse> complete(@PathVariable UUID id) {
        return ApiResponse.ok("Event completed", eventService.complete(id));
    }

    @PostMapping("/{id}/reminders")
    public ApiResponse<EventResponse> addReminder(@PathVariable UUID id, @Valid @RequestBody CreateEventReminderRequest request) {
        return ApiResponse.ok("Event reminder saved", eventService.addReminder(id, request));
    }
}
