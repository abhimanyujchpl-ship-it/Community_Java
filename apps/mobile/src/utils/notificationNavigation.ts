import { router } from "expo-router";
import { AppNotification } from "@/types";

export function openNotificationTarget(notification: AppNotification) {
  let data: Record<string, string> = {};

  try {
    data = notification.dataJson ? JSON.parse(notification.dataJson) : {};
  } catch {
    data = {};
  }

  if ((notification.type === "POST_APPROVED" || notification.type === "POST_REJECTED" || notification.type === "NEW_ANNOUNCEMENT") && data.postId) {
    router.push({ pathname: "/posts/details", params: { postId: data.postId } });
    return;
  }

  if ((notification.type === "NEW_EVENT" || notification.type === "EVENT_REMINDER") && data.eventId) {
    router.push({ pathname: "/events/details", params: { eventId: data.eventId } });
    return;
  }

  if ((notification.type === "ACCESS_REQUEST_APPROVED" || notification.type === "ACCESS_REQUEST_REJECTED") && data.communityId) {
    router.push("/community/request-status");
    return;
  }

  router.push({ pathname: "/notifications/details", params: { notificationId: notification.id } });
}
