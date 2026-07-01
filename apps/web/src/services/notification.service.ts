import { api, ApiResponse, PageResponse, unwrap } from "./api";
import { ENABLE_DEMO_MODE } from "../constants/config";
import { demoData } from "./demoData";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
};

export const notificationService = {
  list: async () => {
    try {
      return unwrap((await api.get<ApiResponse<PageResponse<NotificationItem>>>("/notifications")).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.notifications.list();
      throw error;
    }
  },
  unreadCount: async () => {
    try {
      return unwrap((await api.get<ApiResponse<number | { count: number }>>("/notifications/unread-count")).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.notifications.unreadCount();
      throw error;
    }
  },
  markRead: async (id: string) => {
    try {
      return unwrap((await api.patch<ApiResponse<NotificationItem>>(`/notifications/${id}/read`)).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.notifications.markRead(id);
      throw error;
    }
  },
  markAllRead: async () => {
    try {
      return unwrap((await api.patch<ApiResponse<unknown>>("/notifications/read-all")).data);
    } catch (error) {
      if (ENABLE_DEMO_MODE) return demoData.notifications.markAllRead();
      throw error;
    }
  }
};
