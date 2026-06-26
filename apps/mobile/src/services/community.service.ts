import { api, unwrapPageItems, unwrapRequired } from "./api";
import { ApiResponse, CommunitySummary, PageResponse } from "@/types";

export interface CreateCommunityPayload {
  name: string;
  description?: string;
  logoUrl?: string;
  city: string;
  state: string;
}

export interface UpdateCommunityPayload extends Partial<CreateCommunityPayload> {
  status?: "ACTIVE" | "INACTIVE";
}

export const communityService = {
  search: async (query = "") => {
    const response = await api.get<ApiResponse<PageResponse<CommunitySummary>>>("/communities", { params: { query } });
    return unwrapPageItems(response.data);
  },
  getById: async (communityId: string) => {
    const response = await api.get<ApiResponse<CommunitySummary>>(`/communities/${communityId}`);
    return unwrapRequired(response.data, "Community response was empty");
  },
  create: async (payload: CreateCommunityPayload) => {
    const response = await api.post<ApiResponse<CommunitySummary>>("/communities", payload);
    return unwrapRequired(response.data, "Created community response was empty");
  },
  update: async (communityId: string, payload: UpdateCommunityPayload) => {
    const response = await api.patch<ApiResponse<CommunitySummary>>(`/communities/${communityId}`, payload);
    return unwrapRequired(response.data, "Updated community response was empty");
  },
  dashboard: async (communityId: string) => {
    const response = await api.get<ApiResponse<CommunitySummary>>(`/communities/${communityId}/dashboard`);
    return unwrapRequired(response.data, "Community dashboard response was empty");
  }
};
