import { AccessRequest, ApiResponse } from "@/types";
import { api } from "./api";

export interface CreateAccessRequestPayload {
  communityId: string;
  requestMessage?: string;
}

export const accessRequestService = {
  create: async (payload: CreateAccessRequestPayload) => {
    const response = await api.post<ApiResponse<AccessRequest>>("/access-requests", payload);
    return response.data.data;
  },
  mine: async () => {
    const response = await api.get<ApiResponse<AccessRequest[]>>("/access-requests/my");
    return response.data.data;
  },
  byCommunity: async (communityId: string) => {
    const response = await api.get<ApiResponse<AccessRequest[]>>(`/access-requests/community/${communityId}`);
    return response.data.data;
  },
  approve: async (requestId: string) => {
    const response = await api.patch<ApiResponse<AccessRequest>>(`/access-requests/${requestId}/approve`);
    return response.data.data;
  },
  reject: async (requestId: string, rejectionReason: string) => {
    const response = await api.patch<ApiResponse<AccessRequest>>(`/access-requests/${requestId}/reject`, {
      rejectionReason
    });
    return response.data.data;
  }
};
