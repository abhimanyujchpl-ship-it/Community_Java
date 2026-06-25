import { useCallback } from "react";
import { notificationService } from "@/services/notification.service";

export function useNotifications() {
  const register = useCallback(() => notificationService.registerForPushNotifications(), []);

  return { register };
}
