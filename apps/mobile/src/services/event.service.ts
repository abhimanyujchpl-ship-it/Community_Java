import { ApiResponse, CommunityEvent, ReminderType } from "@/types";
import { api } from "./api";

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
    const response = await api.get<ApiResponse<CommunityEvent[]>>(`/events/community/${communityId}`);
    return response.data.data;
  },
  upcoming: async (communityId: string) => {
    const response = await api.get<ApiResponse<CommunityEvent[]>>(`/events/upcoming/${communityId}`);
    return response.data.data;
  },
  create: async (payload: CreateEventPayload) => {
    const response = await api.post<ApiResponse<CommunityEvent>>("/events", payload);
    return response.data.data;
  },
  details: async (eventId: string) => {
    const response = await api.get<ApiResponse<CommunityEvent>>(`/events/${eventId}`);
    return response.data.data;
  },
  update: async (eventId: string, payload: UpdateEventPayload) => {
    const response = await api.patch<ApiResponse<CommunityEvent>>(`/events/${eventId}`, payload);
    return response.data.data;
  },
  cancel: async (eventId: string) => {
    const response = await api.patch<ApiResponse<CommunityEvent>>(`/events/${eventId}/cancel`);
    return response.data.data;
  },
  complete: async (eventId: string) => {
    const response = await api.patch<ApiResponse<CommunityEvent>>(`/events/${eventId}/complete`);
    return response.data.data;
  },
  addReminder: async (eventId: string, payload: CreateEventReminderPayload) => {
    const response = await api.post<ApiResponse<CommunityEvent>>(`/events/${eventId}/reminders`, payload);
    return response.data.data;
  }
};
