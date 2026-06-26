import * as SecureStore from "expo-secure-store";
import { ApiResponse, AuthResponse, AuthUser, UserSummary } from "@/types";
import { api, unwrapRequired } from "./api";

export interface LoginPayload {
  emailOrMobile: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  city?: string;
  state?: string;
  occupation?: string;
}

export function mapAuthUser(user: UserSummary): AuthUser {
  return {
    id: user.id,
    name: user.fullName,
    phoneNumber: user.mobile,
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    city: user.city,
    state: user.state,
    occupation: user.occupation,
    profilePhotoUrl: user.profilePhotoUrl,
    role: user.role
  };
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return unwrapRequired(response.data, "Login response was empty");
  },
  register: async (payload: RegisterPayload) => {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", payload);
    return unwrapRequired(response.data, "Registration response was empty");
  },
  me: async () => {
    const response = await api.get<ApiResponse<UserSummary>>("/auth/me");
    return unwrapRequired(response.data, "Current user response was empty");
  },
  saveToken: (token: string) => SecureStore.setItemAsync("accessToken", token),
  getToken: () => SecureStore.getItemAsync("accessToken"),
  clearToken: () => SecureStore.deleteItemAsync("accessToken")
};
