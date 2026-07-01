import Constants from "expo-constants";
import { Platform } from "react-native";

const envApiUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? process.env.EXPO_PUBLIC_API_URL;

function getExpoGoApiUrl() {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const host = hostUri?.split(":")[0];

  if (!host || host === "localhost" || host === "127.0.0.1") {
    return null;
  }

  return `http://${host}:8080/api`;
}

function resolveApiUrl() {
  if (envApiUrl?.trim()) {
    return envApiUrl.trim();
  }

  if (Platform.OS === "web") {
    return "http://localhost:8080/api";
  }

  if (Platform.OS === "android") {
    return getExpoGoApiUrl() ?? "http://10.0.2.2:8080/api";
  }

  return getExpoGoApiUrl() ?? "http://localhost:8080/api";
}

export const config = {
  apiUrl: resolveApiUrl()
};
