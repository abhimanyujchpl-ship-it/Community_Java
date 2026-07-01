import { AxiosError } from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardLayout, StatCard, WebAvatar, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { communityService } from "@/services/community.service";
import { dashboardService } from "@/services/dashboard.service";
import { AdminDashboard, CommunitySummary } from "@/types";

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

export default function AdminDashboardScreen() {
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [activeCommunity, setActiveCommunity] = useState<CommunitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const communityItems = await communityService.search("");
      setCommunities(communityItems);
      for (const community of communityItems) {
        try {
          const nextDashboard = await dashboardService.admin(community.id);
          setActiveCommunity(community);
          setDashboard(nextDashboard);
          return;
        } catch {
          // Try the next community; current admin may not manage this one.
        }
      }
      setDashboard(null);
      setActiveCommunity(null);
    } catch (requestError) {
      setError(apiError(requestError, "Unable to load admin dashboard."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createEvent = () => {
    router.push({ pathname: "/events/create", params: activeCommunity ? { communityId: activeCommunity.id } : undefined });
  };

  return (
    <DashboardLayout
      title="Admin Dashboard"
      nav={["Dashboard", "Access Requests", "Post Approvals", "Members", "Events", "Settings"]}
      right={
        <WebCard style={styles.stack}>
          <Text style={styles.heading}>Quick actions</Text>
          <WebButton label="Access Requests" onPress={() => router.push("/admin/access-requests")} />
          <WebButton label="Post Approvals" variant="secondary" onPress={() => router.push("/admin/post-approvals")} />
          <WebButton label="Create Event" variant="secondary" onPress={createEvent} disabled={!activeCommunity} />
          <WebButton label="Members" variant="secondary" onPress={() => router.push("/admin/members")} />
          <WebButton label="Settings" variant="secondary" onPress={() => router.push("/admin/settings")} />
        </WebCard>
      }
    >
      <ScrollView contentContainerStyle={styles.page}>
        {loading ? <LoadingState message="Loading admin dashboard" /> : null}
        {!loading && error ? <EmptyState title="Dashboard unavailable" message={error} icon="error-outline" /> : null}
        {!loading && !error && !dashboard ? <EmptyState title="No manageable community" message={communities.length === 0 ? "Create a community to start using the admin dashboard." : "You do not have admin access to the listed communities."} icon="dashboard" /> : null}
        {!loading && !error && dashboard ? (
          <>
            <WebCard style={styles.profileCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heading}>{dashboard.community.name}</Text>
                <Text style={styles.muted}>{dashboard.community.description ?? "Community profile"}</Text>
                <Text style={styles.muted}>{[dashboard.community.city, dashboard.community.state].filter(Boolean).join(", ") || "Location not set"}</Text>
              </View>
              <WebBadge label={dashboard.community.status} tone={dashboard.community.status === "ACTIVE" ? "success" : "warning"} />
            </WebCard>

            <View style={styles.stats}>
              <StatCard label="Total Members" value={String(dashboard.totalMembers ?? 0)} icon="groups" />
              <StatCard label="Pending Requests" value={String(dashboard.pendingAccessRequests ?? 0)} icon="person-add" />
              <StatCard label="Pending Posts" value={String(dashboard.pendingPostApprovals ?? 0)} icon="rate-review" />
              <StatCard label="Upcoming Events" value={String(dashboard.upcomingEvents ?? 0)} icon="event" />
              <StatCard label="Recent Posts" value={String(dashboard.recentPostsCount ?? 0)} icon="forum" />
              <StatCard label="Notifications" value={String(dashboard.notificationsCount ?? 0)} icon="notifications" />
              <StatCard label="Blocked Users" value={String(dashboard.blockedUsers ?? 0)} icon="block" />
            </View>

            <View style={styles.grid}>
              <WebCard style={styles.column}>
                <Text style={styles.heading}>Pending access requests</Text>
                {dashboard.pendingRequests.length === 0 ? <Text style={styles.muted}>No pending requests.</Text> : null}
                {dashboard.pendingRequests.map((request) => (
                  <View key={request.id} style={styles.row}>
                    <WebAvatar name={request.user.fullName} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{request.user.fullName}</Text>
                      <Text style={styles.muted}>{request.requestMessage || "No message provided."}</Text>
                    </View>
                    <WebBadge label={request.status} tone="warning" />
                  </View>
                ))}
                <WebButton label="Review Requests" variant="secondary" onPress={() => router.push("/admin/access-requests")} />
              </WebCard>

              <WebCard style={styles.column}>
                <Text style={styles.heading}>Pending post approvals</Text>
                {dashboard.pendingPosts.length === 0 ? <Text style={styles.muted}>No pending posts.</Text> : null}
                {dashboard.pendingPosts.map((post) => (
                  <View key={post.id} style={styles.row}>
                    <View style={styles.dot} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{post.title}</Text>
                      <Text style={styles.muted}>By {post.author.fullName}</Text>
                    </View>
                    <WebButton label="Review" variant="ghost" onPress={() => router.push("/admin/post-approvals")} />
                  </View>
                ))}
              </WebCard>
            </View>

            <View style={styles.grid}>
              <WebCard style={styles.column}>
                <Text style={styles.heading}>Upcoming events</Text>
                {dashboard.upcomingEventPreview.length === 0 ? <Text style={styles.muted}>No upcoming events.</Text> : null}
                {dashboard.upcomingEventPreview.map((event) => (
                  <View key={event.id} style={styles.item}>
                    <Text style={styles.rowTitle}>{event.title}</Text>
                    <Text style={styles.muted}>{formatDate(event.startDateTime)} - {event.location}</Text>
                  </View>
                ))}
              </WebCard>

              <WebCard style={styles.column}>
                <Text style={styles.heading}>Recent approved posts</Text>
                {dashboard.recentPosts.length === 0 ? <Text style={styles.muted}>No approved posts yet.</Text> : null}
                {dashboard.recentPosts.map((post) => (
                  <View key={post.id} style={styles.item}>
                    <Text style={styles.rowTitle}>{post.title}</Text>
                    <Text style={styles.muted}>{post.content}</Text>
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
  stats: { flexDirection: "row", gap: spacing.md, flexWrap: "wrap" },
  grid: { flexDirection: "row", gap: spacing.md, flexWrap: "wrap" },
  stack: { gap: spacing.md },
  profileCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap" },
  column: { flex: 1, minWidth: 320, gap: spacing.md },
  heading: { ...typography.headlineSm, color: colors.onSurface, fontFamily: typography.familyBold },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm },
  rowTitle: { color: colors.onSurface, fontWeight: "800" },
  muted: { color: colors.textGrey, lineHeight: 22 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accentGreen },
  item: { gap: spacing.xs, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.outlineVariant }
});

