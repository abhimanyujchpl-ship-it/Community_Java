import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { ApiResponse, PageResponse } from "@/types";
import { config } from "@/constants/config";

const API_URL = config.apiUrl;
const TOKEN_KEY = "accessToken";

async function getAccessToken() {
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }

  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function clearAccessToken() {
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

console.info(`Community API base URL: ${API_URL}`);

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (!axiosError.response) {
      console.error(
        `Backend not reachable at ${API_URL}. Start Spring Boot on port 8080 or set EXPO_PUBLIC_API_BASE_URL to your LAN API URL.`,
        axiosError.message
      );
    }

    if (error.response?.status === 401) {
      await clearAccessToken();
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
