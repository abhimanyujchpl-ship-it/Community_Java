package com.communityapp.modules.events.controller;

import com.communityapp.common.dto.PageResponse;
import com.communityapp.common.response.ApiResponse;
import com.communityapp.common.util.PageableFactory;
import com.communityapp.modules.events.dto.CreateEventReminderRequest;
import com.communityapp.modules.events.dto.CreateEventRequest;
import com.communityapp.modules.events.dto.EventResponse;
import com.communityapp.modules.events.dto.UpdateEventRequest;
import com.communityapp.modules.events.entity.EventStatus;
import com.communityapp.modules.events.service.EventService;
import com.communityapp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Community event and reminder APIs")
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Create event")
    public ApiResponse<EventResponse> create(
            @Valid @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Event created", eventService.create(request, principal.getId()));
    }

    @GetMapping("/community/{communityId}")
    @Operation(summary = "List community events with pagination and optional status filter")
    public ApiResponse<PageResponse<EventResponse>> byCommunity(
            @PathVariable UUID communityId,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok(
                "Events retrieved",
                eventService.byCommunity(communityId, status, principal.getId(), PageableFactory.create(page, size, Sort.by("startDateTime").ascending()))
        );
    }

    @GetMapping("/upcoming/{communityId}")
    @Operation(summary = "List upcoming community events")
    public ApiResponse<PageResponse<EventResponse>> upcoming(
            @PathVariable UUID communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok(
                "Upcoming events retrieved",
                eventService.upcoming(communityId, principal.getId(), PageableFactory.create(page, size, Sort.by("startDateTime").ascending()))
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by UUID")
    public ApiResponse<EventResponse> getById(@PathVariable UUID id) {
        return ApiResponse.ok("Event retrieved", eventService.getById(id));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Update event")
    public ApiResponse<EventResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEventRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Event updated", eventService.update(id, request, principal.getId()));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Cancel event")
    public ApiResponse<EventResponse> cancel(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Event cancelled", eventService.cancel(id, principal.getId()));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Complete event")
    public ApiResponse<EventResponse> complete(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok("Event completed", eventService.complete(id, principal.getId()));
    }

    @PostMapping("/{id}/reminders")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMMUNITY_ADMIN')")
    @Operation(summary = "Add event reminder")
    public ApiResponse<EventResponse> addReminder(
            @PathVariable UUID id,
            @Valid @RequestBody CreateEventReminderRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok("Event reminder saved", eventService.addReminder(id, request, principal.getId()));
    }
}
