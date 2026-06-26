import { Platform } from "react-native";

const envApiUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? process.env.EXPO_PUBLIC_API_URL;

function resolveApiUrl() {
  if (envApiUrl?.trim()) {
    return envApiUrl.trim();
  }

  if (Platform.OS === "web") {
    return "http://localhost:8080/api";
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080/api";
  }

  return "http://localhost:8080/api";
}

export const config = {
  apiUrl: resolveApiUrl()
};
