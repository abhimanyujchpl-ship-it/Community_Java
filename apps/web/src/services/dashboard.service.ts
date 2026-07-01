import { api, ApiResponse, unwrap } from "./api";
import { ENABLE_DEMO_MODE } from "../constants/config";
import { demoData } from "./demoData";

export type DashboardData = Record<string, unknown>;

export const dashboardService = {
  admin: async (communityId: string) => {
    try {
      return unwrap((await api.get<ApiResponse<DashboardData>>(`/dashboard/admin/${communityId}`)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.dashboard.admin();
      throw error;
    }
  },
  member: async (communityId: string) => {
    try {
      return unwrap((await api.get<ApiResponse<DashboardData>>(`/dashboard/member/${communityId}`)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.dashboard.member();
      throw error;
    }
  }
};
