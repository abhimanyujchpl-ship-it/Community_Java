import { MaterialIcons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardLayout, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { notificationService } from "@/services/notification.service";
import { AppNotification, NotificationType } from "@/types";

const iconByType: Record<NotificationType, keyof typeof MaterialIcons.glyphMap> = {
  ACCESS_REQUEST_APPROVED: "verified-user",
  ACCESS_REQUEST_REJECTED: "block",
  NEW_EVENT: "event",
  EVENT_REMINDER: "alarm",
  POST_APPROVED: "check-circle",
  POST_REJECTED: "cancel",
  NEW_ANNOUNCEMENT: "campaign",
  BIRTHDAY_REMINDER: "cake"
};

function apiError(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError.response) {
    return "Backend not reachable. Please start server on port 8080.";
  }
  return axiosError.response.data?.message ?? fallback;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [items, count] = await Promise.all([notificationService.list(), notificationService.unreadCount()]);
      setNotifications(items);
      setUnreadCount(count);
    } catch (requestError) {
      setError(apiError(requestError, "Unable to load notifications."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (notification: AppNotification) => {
    if (notification.isRead) {
      return;
    }

    setActingId(notification.id);
    setError(null);
    try {
      const updated = await notificationService.markRead(notification.id);
      setNotifications((current) => current.map((item) => item.id === updated.id ? updated : item));
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (requestError) {
      setError(apiError(requestError, "Unable to mark notification read."));
    } finally {
      setActingId(null);
    }
  };

  const markAllRead = async () => {
    setActingId("all");
    setError(null);
    try {
      await notificationService.markAllRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (requestError) {
      setError(apiError(requestError, "Unable to mark all notifications read."));
    } finally {
      setActingId(null);
    }
  };

  return (
    <DashboardLayout title={`Notifications (${unreadCount})`} nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>Notifications</Text>
            <Text style={styles.muted}>Unread updates, approvals, events, and reminders.</Text>
          </View>
          <WebButton label={actingId === "all" ? "Marking..." : "Mark all as read"} variant="secondary" icon="done-all" disabled={unreadCount === 0} onPress={markAllRead} />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? <LoadingState message="Loading notifications" /> : null}
        {!loading && notifications.length === 0 ? <EmptyState title="No notifications" message="Event reminders and review updates will appear here." icon="notifications-none" /> : null}
        {!loading && notifications.length > 0 ? (
          <WebCard style={styles.list}>
            {notifications.map((notification) => (
              <View key={notification.id} style={[styles.row, !notification.isRead ? styles.unread : null]}>
                <View style={styles.icon}>
                  <MaterialIcons name={iconByType[notification.type] ?? "notifications"} size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.rowTitle}>{notification.title}</Text>
                    {!notification.isRead ? <WebBadge label="New" tone="warning" /> : null}
                  </View>
                  <Text style={styles.muted}>{notification.message}</Text>
                  <Text style={styles.time}>{formatDate(notification.createdAt)}</Text>
                </View>
                <WebButton label={notification.isRead ? "Read" : actingId === notification.id ? "Marking..." : "Mark read"} variant="secondary" disabled={notification.isRead} onPress={() => markRead(notification)} />
              </View>
            ))}
          </WebCard>
        ) : null}
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md, flexWrap: "wrap" },
  heading: { ...typography.headlineMd, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, marginTop: 4, lineHeight: 21 },
  error: { borderRadius: radius.default, padding: spacing.md, color: colors.error, textAlign: "center", backgroundColor: colors.errorContainer, fontWeight: "700" },
  list: { padding: 0, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant, flexWrap: "wrap" },
  unread: { backgroundColor: colors.surfaceContainerLow },
  icon: { width: 46, height: 46, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceContainer },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  rowTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  time: { color: colors.textGrey, fontWeight: "700", marginTop: spacing.xs }
});

