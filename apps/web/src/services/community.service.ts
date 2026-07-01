import { api, ApiResponse, PageResponse, unwrap } from "./api";
import { ENABLE_DEMO_MODE } from "../constants/config";
import { demoData } from "./demoData";

export type Community = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  city?: string;
  state?: string;
  memberCount?: number;
  status?: string;
};

export const communityService = {
  list: async () => {
    try {
      return unwrap((await api.get<ApiResponse<PageResponse<Community> | Community[]>>("/communities")).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.communities();
      throw error;
    }
  }
};
