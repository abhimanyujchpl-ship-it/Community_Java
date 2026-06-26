import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ApiResponse, PageResponse } from "@/types";
import { config } from "@/constants/config";

const API_URL = config.apiUrl;

if (!API_URL) {
  console.warn("EXPO_PUBLIC_API_URL is not configured. Copy .env.example to .env.");
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("accessToken");
      router.replace("/auth/login");
    }

    return Promise.reject(error);
  }
);

export function unwrapData<T>(response: ApiResponse<T> | null | undefined, fallback: T): T {
  return response?.data ?? fallback;
}

export function unwrapRequired<T>(response: ApiResponse<T> | null | undefined, message = "Empty API response"): T {
  if (response?.data == null) {
    throw new Error(message);
  }

  return response.data;
}

export function unwrapPageItems<T>(response: ApiResponse<PageResponse<T>> | null | undefined): T[] {
  return response?.data?.items ?? [];
}
