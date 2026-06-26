import * as Notifications from "expo-notifications";
import { ApiResponse, AppNotification, PageResponse } from "@/types";
import { api, unwrapData, unwrapPageItems, unwrapRequired } from "./api";

export const notificationService = {
  list: async () => {
    const response = await api.get<ApiResponse<PageResponse<AppNotification>>>("/notifications");
    return unwrapPageItems(response.data);
  },
  unreadCount: async () => {
    const response = await api.get<ApiResponse<{ count: number }>>("/notifications/unread-count");
    return unwrapData(response.data, { count: 0 }).count;
  },
  markRead: async (notificationId: string) => {
    const response = await api.patch<ApiResponse<AppNotification>>(`/notifications/${notificationId}/read`);
    return unwrapRequired(response.data, "Notification response was empty");
  },
  markAllRead: async () => {
    const response = await api.patch<ApiResponse<void>>("/notifications/read-all");
    return unwrapData(response.data, undefined);
  },
  registerForPushNotifications: async () => {
    const permission = await Notifications.requestPermissionsAsync();

    if (!permission.granted) {
      return null;
    }

    return Notifications.getExpoPushTokenAsync();
  }
};
