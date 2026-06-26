import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";
import { colors } from "@/constants/colors";
import { notificationService } from "@/services/notification.service";
import { AppNotification, NotificationType } from "@/types";
import { openNotificationTarget } from "@/utils/notificationNavigation";

const iconByType: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  ACCESS_REQUEST_APPROVED: "checkmark-circle-outline",
  ACCESS_REQUEST_REJECTED: "close-circle-outline",
  NEW_EVENT: "calendar-outline",
  EVENT_REMINDER: "alarm-outline",
  POST_APPROVED: "document-text-outline",
  POST_REJECTED: "document-text-outline",
  NEW_ANNOUNCEMENT: "megaphone-outline",
  BIRTHDAY_REMINDER: "gift-outline"
};

export default function NotificationsTabScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const load = () => {
    setLoading(true);
    notificationService
      .list()
      .then(setNotifications)
      .catch(() => setError("Unable to load notifications."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const open = async (notification: AppNotification) => {
    if (!notification.isRead) {
      const updated = await notificationService.markRead(notification.id);
      setNotifications((items) => items.map((item) => (item.id === updated.id ? updated : item)));
    }
    openNotificationTarget(notification);
  };

  const markAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <>
      <AppHeader title="Notifications" showSearch={false} showNotifications={false} />
      <ScreenContainer padded={false}>
        <View className="flex-row items-center justify-between border-b border-border bg-white px-4 py-3">
          <Text className="text-sm font-semibold text-textGrey">{unreadCount} unread</Text>
          <Pressable onPress={markAllRead} disabled={unreadCount === 0}>
            <Text className={`text-sm font-semibold ${unreadCount === 0 ? "text-textGrey" : "text-primary"}`}>Mark all read</Text>
          </Pressable>
        </View>
        {loading ? <LoadingState message="Loading notifications" /> : null}
        {!loading && error ? (
          <View className="p-4">
            <EmptyState title="Notifications unavailable" message={error} icon="alert-circle-outline" />
          </View>
        ) : null}
        {!loading && !error && notifications.length === 0 ? (
          <View className="p-4">
            <EmptyState title="No notifications" message="Important community updates will appear here." icon="notifications-outline" />
          </View>
        ) : null}
        {!loading &&
          !error &&
          notifications.map((notification) => (
            <WhatsAppStyleListItem
              key={notification.id}
              title={notification.title}
              subtitle={notification.message}
              rightText={new Date(notification.createdAt).toLocaleDateString()}
              badgeLabel={notification.type.replaceAll("_", " ")}
              badgeTone={notification.isRead ? "neutral" : "success"}
              className={notification.isRead ? "bg-white" : "bg-notificationUnread"}
              leftSlot={
                <View className="h-12 w-12 items-center justify-center rounded-full bg-lightBackground">
                  <Ionicons name={iconByType[notification.type]} size={22} color={colors.primary} />
                </View>
              }
              onPress={() => open(notification)}
            />
          ))}
      </ScreenContainer>
    </>
  );
}
