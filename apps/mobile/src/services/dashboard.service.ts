import { AdminDashboard, ApiResponse, MemberDashboard } from "@/types";
import { api } from "./api";

export const dashboardService = {
  admin: async (communityId: string) => {
    const response = await api.get<ApiResponse<AdminDashboard>>(`/api/admin/dashboard/${communityId}`);
    return response.data.data;
  },
  member: async (communityId: string) => {
    const response = await api.get<ApiResponse<MemberDashboard>>(`/api/member/dashboard/${communityId}`);
    return response.data.data;
  }
};
