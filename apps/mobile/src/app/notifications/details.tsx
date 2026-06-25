import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LoadingState } from "@/components/common/LoadingState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AppHeader } from "@/components/headers/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { colors } from "@/constants/colors";
import { notificationService } from "@/services/notification.service";
import { AppNotification } from "@/types";

export default function NotificationDetailsScreen() {
  const { notificationId } = useLocalSearchParams<{ notificationId?: string }>();
  const [notification, setNotification] = useState<AppNotification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    notificationService
      .list()
      .then((items) => {
        const selected = items.find((item) => item.id === notificationId);
        if (!selected) {
          setError("Notification was not found.");
          return;
        }
        setNotification(selected);
        if (!selected.isRead) {
          notificationService.markRead(selected.id).then(setNotification);
        }
      })
      .catch(() => setError("Unable to load notification."))
      .finally(() => setLoading(false));
  }, [notificationId]);

  return (
    <>
      <AppHeader title="Notification" showSearch={false} showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading notification" /> : null}
        {!loading && error ? <EmptyState title="Notification unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && notification ? (
          <View className="rounded-xl border border-border bg-white p-5">
            <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-lightBackground">
              <Ionicons name="notifications-outline" size={24} color={colors.primary} />
            </View>
            <StatusBadge label={notification.type.replaceAll("_", " ")} tone={notification.isRead ? "neutral" : "success"} />
            <Text className="mt-4 text-2xl font-bold text-textDark">{notification.title}</Text>
            <Text className="mt-3 text-base leading-6 text-textDark">{notification.message}</Text>
            <Text className="mt-4 text-sm text-textGrey">{new Date(notification.createdAt).toLocaleString()}</Text>
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}
