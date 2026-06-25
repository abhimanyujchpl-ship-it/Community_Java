import { useEffect, useState } from "react";
import { notificationService } from "@/services/notification.service";

export function useUnreadNotificationCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    notificationService
      .unreadCount()
      .then(setCount)
      .catch(() => setCount(0));
  }, []);

  return count;
}
