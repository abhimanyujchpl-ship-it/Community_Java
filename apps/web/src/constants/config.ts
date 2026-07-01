function defaultApiBaseUrl() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `http://${hostname}:8080/api`;
    }
  }

  return "http://localhost:8080/api";
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl();

export const ENABLE_DEMO_MODE = import.meta.env.VITE_ENABLE_DEMO_MODE !== "false";
