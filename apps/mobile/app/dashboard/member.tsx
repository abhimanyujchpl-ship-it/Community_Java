import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardLayout, StatCard, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { accessRequestService } from "@/services/access-request.service";
import { dashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/auth.store";
import { useCommunityStore } from "@/store/community.store";
import { AccessRequest, CommunityEvent, CommunityPost, MemberDashboard } from "@/types";

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

function statusTone(status: string) {
  if (status === "APPROVED" || status === "UPCOMING") {
    return "success" as const;
  }
  if (status === "REJECTED" || status === "CANCELLED") {
    return "danger" as const;
  }
  if (status === "PENDING_APPROVAL") {
    return "warning" as const;
  }
  return "neutral" as const;
}

function PostPreview({ post }: { post: CommunityPost }) {
  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{post.title}</Text>
        <WebBadge label={post.status === "PENDING_APPROVAL" ? "PENDING" : post.status} tone={statusTone(post.status)} />
      </View>
      <Text style={styles.muted}>{post.content}</Text>
      {post.rejectionReason ? <Text style={styles.rejection}>Rejected: {post.rejectionReason}</Text> : null}
    </View>
  );
}

function EventPreview({ event }: { event: CommunityEvent }) {
  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{event.title}</Text>
        <WebBadge label={event.status} tone={statusTone(event.status)} />
      </View>
      <Text style={styles.muted}>{formatDate(event.startDateTime)} - {event.location}</Text>
      {event.reminders.length > 0 ? <Text style={styles.muted}>{event.reminders.length} reminder(s)</Text> : null}
    </View>
  );
}

export default function MemberDashboardPage() {
  const { communityId: paramCommunityId } = useLocalSearchParams<{ communityId?: string }>();
  const user = useAuthStore((state) => state.user);
  const activeCommunity = useCommunityStore((state) => state.activeCommunity);
  const setActiveCommunity = useCommunityStore((state) => state.setActiveCommunity);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [dashboard, setDashboard] = useState<MemberDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetRequest = useMemo(() => {
    if (paramCommunityId) {
      return requests.find((request) => request.community.id === paramCommunityId) ?? null;
    }
    return requests.find((request) => request.status === "APPROVED") ?? requests.find((request) => request.status === "PENDING") ?? null;
  }, [paramCommunityId, requests]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const myRequests = await accessRequestService.mine();
        setRequests(myRequests);
        const matchingRequest = paramCommunityId
          ? myRequests.find((request) => request.community.id === paramCommunityId)
          : myRequests.find((request) => request.status === "APPROVED") ?? myRequests.find((request) => request.status === "PENDING");
        const nextCommunityId = paramCommunityId ?? activeCommunity?.id ?? matchingRequest?.community.id;

        if (!nextCommunityId) {
          setDashboard(null);
          return;
        }

        if (matchingRequest?.status && matchingRequest.status !== "APPROVED") {
          setDashboard(null);
          return;
        }

        const nextDashboard = await dashboardService.member(nextCommunityId);
        setDashboard(nextDashboard);
        setActiveCommunity(nextDashboard.community);
      } catch (requestError) {
        setDashboard(null);
        setError(apiError(requestError, "Unable to open member dashboard. Approved community membership is required."));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeCommunity?.id, paramCommunityId, setActiveCommunity]);

  return (
    <DashboardLayout
      title="Member Dashboard"
      nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}
      right={
        <WebCard style={styles.stack}>
          <Text style={styles.panelTitle}>Shortcuts</Text>
          <WebButton label="Community Directory" onPress={() => router.push("/community/search")} />
          <WebButton label="Create Post" variant="secondary" disabled={!dashboard} onPress={() => router.push({ pathname: "/posts/create", params: dashboard ? { communityId: dashboard.community.id } : undefined })} />
          <WebButton label="Calendar" variant="secondary" onPress={() => router.push("/events/calendar")} />
          <WebButton label="Profile" variant="secondary" onPress={() => router.push("/profile")} />
        </WebCard>
      }
    >
      <ScrollView contentContainerStyle={styles.page}>
        {loading ? <LoadingState message="Loading member dashboard" /> : null}
        {!loading && error ? <EmptyState title="Dashboard unavailable" message={error} icon="lock" /> : null}
        {!loading && !error && !dashboard && targetRequest?.status === "PENDING" ? (
          <WebCard style={styles.pendingCard}>
            <WebBadge label="Pending" tone="warning" />
            <Text style={styles.heading}>Access request pending</Text>
            <Text style={styles.muted}>Your request to join {targetRequest.community.name} is waiting for admin review. You will be notified after approval or rejection.</Text>
            <WebButton label="Browse Communities" variant="secondary" onPress={() => router.push("/community/search")} />
          </WebCard>
        ) : null}
        {!loading && !error && !dashboard && !targetRequest ? (
          <WebCard style={styles.pendingCard}>
            <Text style={styles.heading}>Select a community</Text>
            <Text style={styles.muted}>Request access to a community before opening a private member dashboard.</Text>
            <WebButton label="Browse Communities" onPress={() => router.push("/community/search")} />
          </WebCard>
        ) : null}
        {!loading && !error && dashboard ? (
          <>
            <WebCard style={styles.hero}>
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>Welcome back{user?.name ? `, ${user.name}` : ""}</Text>
                <Text style={styles.heading}>{dashboard.community.name}</Text>
                <Text style={styles.muted}>{dashboard.community.description ?? "Approved community dashboard"}</Text>
                <Text style={styles.muted}>{[dashboard.community.city, dashboard.community.state].filter(Boolean).join(", ") || "Location not set"}</Text>
              </View>
              <WebBadge label="Approved member" tone="success" />
            </WebCard>

            <View style={styles.stats}>
              <StatCard label="Unread Alerts" value={String(dashboard.notificationsCount ?? 0)} icon="notifications" />
              <StatCard label="Upcoming Events" value={String(dashboard.upcomingEvents.length)} icon="event" />
              <StatCard label="Feed Preview" value={String(dashboard.feedPreview.length)} icon="forum" />
              <StatCard label="My Posts" value={String(dashboard.myPostsStatus.length)} icon="article" />
            </View>

            <View style={styles.grid}>
              <WebCard style={styles.column}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.panelTitle}>Community feed preview</Text>
                  <WebButton label="Open Feed" variant="ghost" onPress={() => router.push({ pathname: "/feed", params: { communityId: dashboard.community.id } })} />
                </View>
                {dashboard.feedPreview.length === 0 ? <Text style={styles.muted}>No approved posts yet.</Text> : null}
                {dashboard.feedPreview.map((post) => <PostPreview key={post.id} post={post} />)}
              </WebCard>

              <WebCard style={styles.column}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.panelTitle}>Upcoming events</Text>
                  <WebButton label="View Events" variant="ghost" onPress={() => router.push({ pathname: "/events", params: { communityId: dashboard.community.id } })} />
                </View>
                {dashboard.upcomingEvents.length === 0 ? <Text style={styles.muted}>No upcoming events.</Text> : null}
                {dashboard.upcomingEvents.map((event) => <EventPreview key={event.id} event={event} />)}
              </WebCard>
            </View>

            <View style={styles.grid}>
              <WebCard style={styles.column}>
                <Text style={styles.panelTitle}>Calendar reminders</Text>
                {dashboard.calendarReminders.length === 0 ? <Text style={styles.muted}>No event reminders.</Text> : null}
                {dashboard.calendarReminders.map((event) => <EventPreview key={event.id} event={event} />)}
              </WebCard>

              <WebCard style={styles.column}>
                <Text style={styles.panelTitle}>Announcements</Text>
                {dashboard.announcements.length === 0 ? <Text style={styles.muted}>No announcements.</Text> : null}
                {dashboard.announcements.map((post) => <PostPreview key={post.id} post={post} />)}
              </WebCard>
            </View>

            <View style={styles.grid}>
              <WebCard style={styles.column}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.panelTitle}>My posts status</Text>
                  <WebButton label="My Posts" variant="ghost" onPress={() => router.push("/posts/my-posts")} />
                </View>
                {dashboard.myPostsStatus.length === 0 ? <Text style={styles.muted}>No submitted posts yet.</Text> : null}
                {dashboard.myPostsStatus.map((post) => <PostPreview key={post.id} post={post} />)}
              </WebCard>

              <WebCard style={styles.column}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.panelTitle}>Notifications</Text>
                  <WebButton label="Open" variant="ghost" onPress={() => router.push("/notifications")} />
                </View>
                {dashboard.notifications.length === 0 ? <Text style={styles.muted}>No notifications.</Text> : null}
                {dashboard.notifications.map((notification) => (
                  <View key={notification.id} style={styles.item}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{notification.title}</Text>
                      <WebBadge label={notification.isRead ? "Read" : "New"} tone={notification.isRead ? "neutral" : "warning"} />
                    </View>
                    <Text style={styles.muted}>{notification.message}</Text>
                  </View>
                ))}
              </WebCard>
            </View>
          </>
        ) : null}
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  stack: { gap: spacing.md },
  pendingCard: { gap: spacing.md },
  hero: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap" },
  eyebrow: { color: colors.primary, fontWeight: "800" },
  heading: { ...typography.headlineSm, color: colors.onSurface, fontFamily: typography.familyBold },
  panelTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  rejection: { color: colors.error, fontWeight: "700" },
  stats: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  column: { flex: 1, minWidth: 320, gap: spacing.md },
  item: { gap: spacing.xs, borderRadius: radius.default, padding: spacing.md, backgroundColor: colors.surfaceContainerLow },
  itemHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm, flexWrap: "wrap" },
  itemTitle: { color: colors.onSurface, fontWeight: "800" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm, flexWrap: "wrap" }
});

