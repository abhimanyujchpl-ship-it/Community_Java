import { api, ApiResponse, PageResponse, unwrap } from "./api";
import { ENABLE_DEMO_MODE } from "../constants/config";
import { demoData } from "./demoData";

export type AccessRequest = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestMessage?: string;
  rejectionReason?: string;
  createdAt?: string;
  user?: { fullName?: string; email?: string; mobile?: string };
  community?: { id: string; name: string };
};

export const accessRequestService = {
  create: async (payload: { communityId: string; requestMessage?: string }) => {
    try {
      return unwrap((await api.post<ApiResponse<AccessRequest>>("/access-requests", payload)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.accessRequests.create(payload);
      throw error;
    }
  },
  my: async () => {
    try {
      return unwrap((await api.get<ApiResponse<PageResponse<AccessRequest>>>("/access-requests/my")).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.accessRequests.my();
      throw error;
    }
  },
  byCommunity: async (communityId: string, status?: string) => {
    try {
      return unwrap((await api.get<ApiResponse<PageResponse<AccessRequest>>>(`/access-requests/community/${communityId}`, { params: { status } })).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.accessRequests.byCommunity(communityId, status);
      throw error;
    }
  },
  approve: async (id: string) => {
    try {
      return unwrap((await api.patch<ApiResponse<AccessRequest>>(`/access-requests/${id}/approve`)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.accessRequests.approve(id);
      throw error;
    }
  },
  reject: async (id: string, rejectionReason: string) => {
    try {
      return unwrap((await api.patch<ApiResponse<AccessRequest>>(`/access-requests/${id}/reject`, { rejectionReason })).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.accessRequests.reject(id, rejectionReason);
      throw error;
    }
  }
};
