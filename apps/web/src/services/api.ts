import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../constants/config";
import { clearAuth, getToken } from "../store/auth.store";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
};

export type PageResponse<T> = {
  items: T[];
  totalItems?: number;
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401 && !getToken()?.startsWith("demo-token-")) {
      clearAuth();
      if (window.location.pathname !== "/auth/login") {
        window.location.assign("/auth/login");
      }
    }
    return Promise.reject(error);
  }
);

export function getApiError(error: unknown) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    if (error.code === "ECONNABORTED" || !error.response) {
      return "Backend not reachable. Please start backend on port 8080.";
    }
    return error.response.data?.message || "Request failed. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export function unwrap<T>(response: ApiResponse<T>) {
  return response.data;
}

export function pageItems<T>(value: PageResponse<T> | T[] | undefined | null) {
  if (!value) return [];
  return Array.isArray(value) ? value : value.items || [];
}
