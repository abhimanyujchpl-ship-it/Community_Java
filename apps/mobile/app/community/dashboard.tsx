import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { EventCard } from "@/components/cards/EventCard";
import { LoadingState } from "@/components/common/LoadingState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";
import { colors } from "@/constants/colors";
import { dashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/auth.store";
import { useCommunityStore } from "@/store/community.store";
import { MemberDashboard } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { postStatusTone, postTypeLabel } from "@/utils/postStatus";

function Shortcut({
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

export default function CommunityDashboardScreen() {
  const { communityId: paramCommunityId } = useLocalSearchParams<{ communityId?: string }>();
  const activeCommunity = useCommunityStore((state) => state.activeCommunity);
  const user = useAuthStore((state) => state.user);
  const communityId = paramCommunityId ?? activeCommunity?.id;
  const [dashboard, setDashboard] = useState<MemberDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!communityId) {
      setError("Select a community to open your dashboard.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    dashboardService
      .member(communityId)
      .then(setDashboard)
      .catch(() => setError("Unable to load member dashboard. Approved community membership is required."))
      .finally(() => setLoading(false));
  }, [communityId]);

  return (
    <>
      <AppHeader
        title="Dashboard"
        notificationCount={dashboard?.notificationsCount ?? 0}
        onNotificationsPress={() => router.push("/tabs/notifications")}
      />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading dashboard" /> : null}
        {!loading && error ? <EmptyState title="Dashboard unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && !error && dashboard ? (
          <View className="gap-4">
            <View className="rounded-lg bg-white p-4">
              <Text className="text-sm font-medium text-textGrey">Welcome back</Text>
              <Text className="mt-1 text-2xl font-bold text-textDark" numberOfLines={2}>{user?.name ?? "Member"}</Text>
              <Text className="mt-2 text-sm leading-5 text-textGrey">
                Here is what is new in {dashboard.community.name}.
              </Text>
            </View>

            <View className="rounded-lg border border-border bg-lightBackground p-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-xs font-semibold uppercase text-primary">Community</Text>
                  <Text className="mt-1 text-xl font-bold text-textDark" numberOfLines={2}>{dashboard.community.name}</Text>
                  <Text className="mt-1 text-sm text-textGrey">
                    {dashboard.community.city}, {dashboard.community.state}
                  </Text>
                </View>
                <StatusBadge label={`${dashboard.community.memberCount} members`} tone="neutral" />
              </View>
              {dashboard.community.description ? (
                <Text className="mt-3 text-sm leading-5 text-textDark" numberOfLines={3}>
                  {dashboard.community.description}
                </Text>
              ) : null}
            </View>

            <View className="flex-row gap-2">
              <Shortcut
                label="My Profile"
                icon="person-circle-outline"
                onPress={() => router.push("/user/profile")}
              />
              <Shortcut
                label="Directory"
                icon="people-outline"
                onPress={() => router.push("/community/search")}
              />
              <Shortcut
                label="Notify"
                icon="notifications-outline"
                onPress={() => router.push("/tabs/notifications")}
              />
              <Shortcut
                label="Post"
                icon="create-outline"
                onPress={() => router.push({ pathname: "/posts/create", params: { communityId } })}
              />
            </View>

            <View>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-bold text-textDark">Upcoming event</Text>
                <Pressable onPress={() => router.push({ pathname: "/events/list", params: { communityId } })}>
                  <Text className="text-sm font-semibold text-primary">View all</Text>
                </Pressable>
              </View>
              {dashboard.upcomingEvents[0] ? (
                <EventCard
                  event={dashboard.upcomingEvents[0]}
                  onPress={() => router.push({ pathname: "/events/details", params: { eventId: dashboard.upcomingEvents[0].id } })}
                />
              ) : (
                <EmptyState title="No upcoming events" message="Scheduled community events will appear here." icon="calendar-outline" />
              )}
            </View>

            <View className="overflow-hidden rounded-lg border border-border bg-white">
              <View className="border-b border-border px-4 py-3">
                <Text className="text-base font-bold text-textDark">Community feed</Text>
              </View>
              {dashboard.feedPreview.length === 0 ? (
                <View className="p-4">
                  <EmptyState title="No feed posts" message="Approved community posts will appear here." />
                </View>
              ) : null}
              {dashboard.feedPreview.map((post) => (
                <WhatsAppStyleListItem
                  key={post.id}
                  title={post.title}
                  subtitle={post.content}
                  rightText={formatDate(post.createdAt)}
                  badgeLabel={postTypeLabel(post.postType)}
                  badgeTone="neutral"
                  onPress={() => router.push({ pathname: "/posts/details", params: { postId: post.id } })}
                />
              ))}
            </View>

            <View className="overflow-hidden rounded-lg border border-border bg-white">
              <View className="border-b border-border px-4 py-3">
                <Text className="text-base font-bold text-textDark">Announcements</Text>
              </View>
              {dashboard.announcements.length === 0 ? (
                <View className="p-4">
                  <EmptyState title="No announcements" message="Admin announcements will appear here." icon="megaphone-outline" />
                </View>
              ) : null}
              {dashboard.announcements.map((post) => (
                <WhatsAppStyleListItem
                  key={post.id}
                  title={post.title}
                  subtitle={post.content}
                  rightText={formatDate(post.createdAt)}
                  badgeLabel="Announcement"
                  badgeTone="success"
                  onPress={() => router.push({ pathname: "/posts/details", params: { postId: post.id } })}
                />
              ))}
            </View>

            <View className="overflow-hidden rounded-lg border border-border bg-white">
              <View className="border-b border-border px-4 py-3">
                <Text className="text-base font-bold text-textDark">Calendar reminders</Text>
              </View>
              {dashboard.calendarReminders.length === 0 ? (
                <View className="p-4">
                  <EmptyState title="No reminders" message="Events with reminders will appear here." icon="alarm-outline" />
                </View>
              ) : null}
              {dashboard.calendarReminders.map((event) => (
                <WhatsAppStyleListItem
                  key={event.id}
                  title={event.title}
                  subtitle={event.reminders[0]?.message ?? event.location}
                  rightText={formatDate(event.startDateTime)}
                  badgeLabel={`${event.reminders.length} reminders`}
                  badgeTone="warning"
                  onPress={() => router.push({ pathname: "/events/details", params: { eventId: event.id } })}
                />
              ))}
            </View>

            <View className="overflow-hidden rounded-lg border border-border bg-white">
              <View className="border-b border-border px-4 py-3">
                <Text className="text-base font-bold text-textDark">My posts</Text>
              </View>
              {dashboard.myPostsStatus.length === 0 ? (
                <View className="p-4">
                  <EmptyState title="No posts yet" message="Your submitted posts and review status will appear here." />
                </View>
              ) : null}
              {dashboard.myPostsStatus.map((post) => (
                <WhatsAppStyleListItem
                  key={post.id}
                  title={post.title}
                  subtitle={post.rejectionReason ?? post.content}
                  rightText={formatDate(post.updatedAt)}
                  badgeLabel={post.status}
                  badgeTone={postStatusTone(post.status)}
                  onPress={() => router.push({ pathname: "/posts/details", params: { postId: post.id } })}
                />
              ))}
            </View>

            <View className="overflow-hidden rounded-lg border border-border bg-white">
              <View className="border-b border-border px-4 py-3">
                <Text className="text-base font-bold text-textDark">Notifications</Text>
              </View>
              {dashboard.notifications.length === 0 ? (
                <View className="p-4">
                  <EmptyState title="No notifications" message="Community updates and review messages will appear here." />
                </View>
              ) : null}
              {dashboard.notifications.map((notification) => (
                <WhatsAppStyleListItem
                  key={notification.id}
                  title={notification.title}
                  subtitle={notification.message}
                  rightText={formatDate(notification.createdAt)}
                  badgeLabel={notification.isRead ? "Read" : "New"}
                  badgeTone={notification.isRead ? "neutral" : "warning"}
                  onPress={() => router.push({ pathname: "/notifications/details", params: { notificationId: notification.id } })}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}
