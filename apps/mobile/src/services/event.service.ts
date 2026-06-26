import { ApiResponse, CommunityEvent, PageResponse, ReminderType } from "@/types";
import { api, unwrapPageItems, unwrapRequired } from "./api";

export interface CreateEventPayload {
  communityId: string;
  title: string;
  eventType: string;
  description?: string;
  bannerUrl?: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  organizerName?: string;
}

export type UpdateEventPayload = Partial<Omit<CreateEventPayload, "communityId">>;

export interface CreateEventReminderPayload {
  reminderType: ReminderType;
  reminderDateTime: string;
  message: string;
}

export const eventService = {
  byCommunity: async (communityId: string) => {
    const response = await api.get<ApiResponse<PageResponse<CommunityEvent>>>(`/events/community/${communityId}`);
    return unwrapPageItems(response.data);
  },
  upcoming: async (communityId: string) => {
    const response = await api.get<ApiResponse<PageResponse<CommunityEvent>>>(`/events/upcoming/${communityId}`);
    return unwrapPageItems(response.data);
  },
  create: async (payload: CreateEventPayload) => {
    const response = await api.post<ApiResponse<CommunityEvent>>("/events", payload);
    return unwrapRequired(response.data, "Created event response was empty");
  },
  details: async (eventId: string) => {
    const response = await api.get<ApiResponse<CommunityEvent>>(`/events/${eventId}`);
    return unwrapRequired(response.data, "Event response was empty");
  },
  update: async (eventId: string, payload: UpdateEventPayload) => {
    const response = await api.patch<ApiResponse<CommunityEvent>>(`/events/${eventId}`, payload);
    return unwrapRequired(response.data, "Updated event response was empty");
  },
  cancel: async (eventId: string) => {
    const response = await api.patch<ApiResponse<CommunityEvent>>(`/events/${eventId}/cancel`);
    return unwrapRequired(response.data, "Cancelled event response was empty");
  },
  complete: async (eventId: string) => {
    const response = await api.patch<ApiResponse<CommunityEvent>>(`/events/${eventId}/complete`);
    return unwrapRequired(response.data, "Completed event response was empty");
  },
  addReminder: async (eventId: string, payload: CreateEventReminderPayload) => {
    const response = await api.post<ApiResponse<CommunityEvent>>(`/events/${eventId}/reminders`, payload);
    return unwrapRequired(response.data, "Event reminder response was empty");
  }
};
