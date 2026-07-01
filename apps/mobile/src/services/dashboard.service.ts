import { AdminDashboard, ApiResponse, MemberDashboard } from "@/types";
import { api, unwrapRequired } from "./api";

export const dashboardService = {
  admin: async (communityId: string) => {
    const response = await api.get<ApiResponse<AdminDashboard>>(`/dashboard/admin/${communityId}`);
    return unwrapRequired(response.data, "Admin dashboard response was empty");
  },
  member: async (communityId: string) => {
    const response = await api.get<ApiResponse<MemberDashboard>>(`/dashboard/member/${communityId}`);
    return unwrapRequired(response.data, "Member dashboard response was empty");
  }
};
