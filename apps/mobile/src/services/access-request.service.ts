import { AccessRequest, ApiResponse, PageResponse } from "@/types";
import { api, unwrapPageItems, unwrapRequired } from "./api";

export interface CreateAccessRequestPayload {
  communityId: string;
  requestMessage?: string;
}

export const accessRequestService = {
  create: async (payload: CreateAccessRequestPayload) => {
    const response = await api.post<ApiResponse<AccessRequest>>("/access-requests", payload);
    return unwrapRequired(response.data, "Access request response was empty");
  },
  mine: async () => {
    const response = await api.get<ApiResponse<PageResponse<AccessRequest>>>("/access-requests/my");
    return unwrapPageItems(response.data);
  },
  byCommunity: async (communityId: string) => {
    const response = await api.get<ApiResponse<PageResponse<AccessRequest>>>(`/access-requests/community/${communityId}`);
    return unwrapPageItems(response.data);
  },
  approve: async (requestId: string) => {
    const response = await api.patch<ApiResponse<AccessRequest>>(`/access-requests/${requestId}/approve`);
    return unwrapRequired(response.data, "Approved access request response was empty");
  },
  reject: async (requestId: string, rejectionReason: string) => {
    const response = await api.patch<ApiResponse<AccessRequest>>(`/access-requests/${requestId}/reject`, {
      rejectionReason
    });
    return unwrapRequired(response.data, "Rejected access request response was empty");
  }
};
