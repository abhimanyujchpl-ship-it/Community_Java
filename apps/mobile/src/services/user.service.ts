import { ApiResponse, PageResponse, UserSummary } from "@/types";
import { api, unwrapPageItems, unwrapRequired } from "./api";

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  mobile?: string;
  city?: string;
  state?: string;
  occupation?: string;
  profilePhotoUrl?: string;
}

export const userService = {
  list: async (query = "") => {
    const response = await api.get<ApiResponse<PageResponse<UserSummary>>>("/users", { params: { query } });
    return unwrapPageItems(response.data);
  },
  update: async (userId: string, payload: UpdateUserPayload) => {
    const response = await api.patch<ApiResponse<UserSummary>>(`/users/${userId}`, payload);
    return unwrapRequired(response.data, "User response was empty");
  }
};
