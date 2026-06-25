import * as SecureStore from "expo-secure-store";
import { api } from "./api";

export interface LoginPayload {
  phoneNumber: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phoneNumber: string;
  password: string;
}

export const authService = {
  login: (payload: LoginPayload) => api.post("/auth/login", payload),
  register: (payload: RegisterPayload) => api.post("/auth/register", payload),
  verifyOtp: (phoneNumber: string, otp: string) => api.post("/auth/otp/verify", { phoneNumber, otp }),
  saveToken: (token: string) => SecureStore.setItemAsync("accessToken", token),
  clearToken: () => SecureStore.deleteItemAsync("accessToken")
};
