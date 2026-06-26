import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LoadingState } from "@/components/common/LoadingState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";
import { colors } from "@/constants/colors";
import { dashboardService } from "@/services/dashboard.service";
import { useCommunityStore } from "@/store/community.store";
import { AdminDashboard } from "@/types";
import { formatDate } from "@/utils/formatDate";

function StatCard({ label, value, icon }: { label: string; value: number; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View className="w-[48%] rounded-lg border border-border bg-white p-3">
      <View className="mb-3 h-9 w-9 items-center justify-center rounded-full bg-lightBackground">
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text className="text-2xl font-bold text-textDark">{value}</Text>
      <Text className="mt-1 text-xs font-medium text-textGrey">{label}</Text>
    </View>
  );
}

function QuickAction({
  label,
  icon,
  onPress
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable className="flex-1 items-center gap-2 rounded-lg border border-border bg-white px-2 py-3" onPress={onPress}>
      <Ionicons name={icon} size={21} color={colors.primary} />
      <Text className="text-center text-xs font-semibold text-textDark">{label}</Text>
    </Pressable>
  );
}

export default function AdminDashboardScreen() {
  const { communityId: paramCommunityId } = useLocalSearchParams<{ communityId?: string }>();
  const activeCommunity = useCommunityStore((state) => state.activeCommunity);
  const communityId = paramCommunityId ?? activeCommunity?.id;
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!communityId) {
      setError("Select a community to open the admin dashboard.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    dashboardService
      .admin(communityId)
      .then(setDashboard)
      .catch(() => setError("Unable to load admin dashboard. Check your community admin access."))
      .finally(() => setLoading(false));
  }, [communityId]);

  const hasPendingWork = useMemo(
    () => Boolean(dashboard && (dashboard.pendingRequests.length > 0 || dashboard.pendingPosts.length > 0)),
    [dashboard]
  );

  return (
    <>
      <AppHeader
        title="Admin"
        notificationCount={dashboard?.notificationsCount ?? 0}
        onNotificationsPress={() => router.push("/tabs/notifications")}
      />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading admin dashboard" /> : null}
        {!loading && error ? <EmptyState title="Dashboard unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && !error && dashboard ? (
          <View className="gap-4">
            <View className="rounded-lg bg-primary p-4">
              <Text className="text-xs font-semibold uppercase text-white/80">Community profile</Text>
              <Text className="mt-1 text-2xl font-bold text-white" numberOfLines={2}>{dashboard.community.name}</Text>
              <Text className="mt-1 text-sm text-white/85">
                {dashboard.community.city}, {dashboard.community.state}
              </Text>
              <View className="mt-3 flex-row gap-2">
                <StatusBadge label={dashboard.community.status} tone="success" />
                <StatusBadge label={`${dashboard.totalMembers} members`} tone="neutral" />
              </View>
            </View>

            <View className="flex-row flex-wrap justify-between gap-y-3">
              <StatCard label="Total members" value={dashboard.totalMembers} icon="people-outline" />
              <StatCard label="Access requests" value={dashboard.pendingAccessRequests} icon="person-add-outline" />
              <StatCard label="Post approvals" value={dashboard.pendingPostApprovals} icon="document-text-outline" />
              <StatCard label="Upcoming events" value={dashboard.upcomingEvents} icon="calendar-outline" />
              <StatCard label="Recent posts" value={dashboard.recentPostsCount} icon="chatbubble-ellipses-outline" />
              <StatCard label="Blocked users" value={dashboard.blockedUsers} icon="ban-outline" />
            </View>

            <View className="flex-row gap-2">
              <QuickAction
                label="Requests"
                icon="person-add-outline"
                onPress={() => router.push({ pathname: "/admin/access-requests", params: { communityId } })}
              />
              <QuickAction
                label="Approvals"
                icon="checkmark-done-outline"
                onPress={() => router.push({ pathname: "/admin/post-approvals", params: { communityId } })}
              />
              <QuickAction
                label="Members"
                icon="people-outline"
                onPress={() => router.push({ pathname: "/admin/members", params: { communityId } })}
              />
              <QuickAction
                label="Events"
                icon="calendar-outline"
                onPress={() => router.push({ pathname: "/events/list", params: { communityId } })}
              />
            </View>

            <View className="overflow-hidden rounded-lg border border-border bg-white">
              <View className="border-b border-border px-4 py-3">
                <Text className="text-base font-bold text-textDark">Pending reviews</Text>
              </View>
              {!hasPendingWork ? (
                <View className="p-4">
                  <EmptyState title="All caught up" message="Pending access requests and post approvals will appear here." />
                </View>
              ) : null}
              {dashboard.pendingRequests.map((request) => (
                <WhatsAppStyleListItem
                  key={request.id}
                  title={request.user.fullName}
                  subtitle={request.requestMessage ?? "Requested access"}
                  rightText={formatDate(request.createdAt)}
                  badgeLabel="Request"
                  badgeTone="warning"
                  onPress={() =>
                    router.push({ pathname: "/admin/access-request-review", params: { requestId: request.id, communityId } })
                  }
                />
              ))}
              {dashboard.pendingPosts.map((post) => (
                <WhatsAppStyleListItem
                  key={post.id}
                  title={post.title}
                  subtitle={post.author.fullName}
                  rightText={formatDate(post.createdAt)}
                  badgeLabel="Post"
                  badgeTone="warning"
                  onPress={() => router.push({ pathname: "/admin/post-review", params: { postId: post.id, communityId } })}
                />
              ))}
            </View>

            <View className="overflow-hidden rounded-lg border border-border bg-white">
              <View className="border-b border-border px-4 py-3">
                <Text className="text-base font-bold text-textDark">Recent activity</Text>
              </View>
              {dashboard.recentPosts.length === 0 && dashboard.upcomingEventPreview.length === 0 ? (
                <View className="p-4">
                  <EmptyState title="No recent activity" message="Approved posts and upcoming events will appear here." />
                </View>
              ) : null}
              {dashboard.recentPosts.map((post) => (
                <WhatsAppStyleListItem
                  key={post.id}
                  title={post.title}
                  subtitle={post.content}
                  rightText={formatDate(post.createdAt)}
                  badgeLabel={post.postType}
                  badgeTone="success"
                  onPress={() => router.push({ pathname: "/posts/details", params: { postId: post.id } })}
                />
              ))}
              {dashboard.upcomingEventPreview.map((event) => (
                <WhatsAppStyleListItem
                  key={event.id}
                  title={event.title}
                  subtitle={event.location}
                  rightText={formatDate(event.startDateTime)}
                  badgeLabel="Event"
                  badgeTone="neutral"
                  onPress={() => router.push({ pathname: "/events/details", params: { eventId: event.id } })}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}
