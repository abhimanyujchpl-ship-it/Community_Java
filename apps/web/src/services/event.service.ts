import { api, ApiResponse, PageResponse, unwrap } from "./api";
import { ENABLE_DEMO_MODE } from "../constants/config";
import { demoData } from "./demoData";

export type EventItem = {
  id: string;
  title: string;
  eventType: string;
  description?: string;
  location?: string;
  organizerName?: string;
  startDateTime: string;
  endDateTime: string;
  status: string;
};

export const eventService = {
  create: async (payload: {
    communityId: string;
    title: string;
    eventType: string;
    description?: string;
    location: string;
    startDateTime: string;
    endDateTime: string;
    organizerName?: string;
  }) => {
    try {
      return unwrap((await api.post<ApiResponse<EventItem>>("/events", payload)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.events.create(payload);
      throw error;
    }
  },
  byCommunity: async (communityId: string, status?: string) => {
    try {
      return unwrap((await api.get<ApiResponse<PageResponse<EventItem>>>(`/events/community/${communityId}`, { params: { status } })).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.events.byCommunity(communityId, status);
      throw error;
    }
  },
  upcoming: async (communityId: string) => {
    try {
      return unwrap((await api.get<ApiResponse<PageResponse<EventItem>>>(`/events/upcoming/${communityId}`)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.events.upcoming(communityId);
      throw error;
    }
  },
  cancel: async (id: string) => {
    try {
      return unwrap((await api.patch<ApiResponse<EventItem>>(`/events/${id}/cancel`)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.events.updateStatus(id, "CANCELLED");
      throw error;
    }
  },
  complete: async (id: string) => {
    try {
      return unwrap((await api.patch<ApiResponse<EventItem>>(`/events/${id}/complete`)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.events.updateStatus(id, "COMPLETED");
      throw error;
    }
  }
};
