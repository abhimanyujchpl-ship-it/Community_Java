import { api } from "./api";
import { ApiResponse, CommunitySummary } from "@/types";

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
    const response = await api.get<ApiResponse<CommunitySummary[]>>("/communities", { params: { query } });
    return response.data.data;
  },
  getById: async (communityId: string) => {
    const response = await api.get<ApiResponse<CommunitySummary>>(`/communities/${communityId}`);
    return response.data.data;
  },
  create: async (payload: CreateCommunityPayload) => {
    const response = await api.post<ApiResponse<CommunitySummary>>("/communities", payload);
    return response.data.data;
  },
  update: async (communityId: string, payload: UpdateCommunityPayload) => {
    const response = await api.patch<ApiResponse<CommunitySummary>>(`/communities/${communityId}`, payload);
    return response.data.data;
  },
  dashboard: (communityId: string) => api.get(`/communities/${communityId}/dashboard`)
};
