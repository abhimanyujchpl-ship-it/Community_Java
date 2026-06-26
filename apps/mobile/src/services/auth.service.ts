import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { ApiResponse, AuthResponse, AuthUser, UserSummary } from "@/types";
import { api, unwrapRequired } from "./api";

const TOKEN_KEY = "accessToken";

const tokenStorage = {
  save: async (token: string) => {
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      return;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  get: async () => {
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }

    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  clear: async () => {
    if (Platform.OS === "web" && typeof localStorage !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

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
  saveToken: tokenStorage.save,
  getToken: tokenStorage.get,
  clearToken: tokenStorage.clear
};
