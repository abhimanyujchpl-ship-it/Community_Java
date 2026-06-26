import * as Notifications from "expo-notifications";
import { ApiResponse, AppNotification, PageResponse } from "@/types";
import { api } from "./api";

export const notificationService = {
  list: async () => {
    const response = await api.get<ApiResponse<PageResponse<AppNotification>>>("/notifications");
    return response.data.data.items;
  },
  unreadCount: async () => {
    const response = await api.get<ApiResponse<{ count: number }>>("/notifications/unread-count");
    return response.data.data.count;
  },
  markRead: async (notificationId: string) => {
    const response = await api.patch<ApiResponse<AppNotification>>(`/notifications/${notificationId}/read`);
    return response.data.data;
  },
  markAllRead: async () => {
    const response = await api.patch<ApiResponse<void>>("/notifications/read-all");
    return response.data.data;
  },
  registerForPushNotifications: async () => {
    const permission = await Notifications.requestPermissionsAsync();

    if (!permission.granted) {
      return null;
    }

    return Notifications.getExpoPushTokenAsync();
  }
};
