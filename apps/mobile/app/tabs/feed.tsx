import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PostCard } from "@/components/cards/PostCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { SearchInput } from "@/components/forms/SearchInput";
import { AppHeader } from "@/components/layout/AppHeader";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { shadows } from "@/constants/shadows";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { CommunityPost } from "@/types";

const mockCommunity = {
  id: "preview-community",
  name: "Green Valley Residents",
  description: "Local updates and resident discussions",
  city: "Pune",
  state: "Maharashtra",
  status: "ACTIVE" as const,
  memberCount: 1248
};

const mockAuthor = {
  id: "preview-user",
  fullName: "Aarav Mehta",
  email: "aarav@example.com",
  mobile: "9999999999",
  role: "MEMBER" as const,
  status: "ACTIVE" as const
};

const previewPosts: CommunityPost[] = [
  {
    id: "post-1",
    community: mockCommunity,
    author: mockAuthor,
    postType: "ANNOUNCEMENT",
    title: "Water supply maintenance on Sunday",
    content: "The maintenance team will inspect the overhead tanks between 9 AM and 12 PM. Please store water in advance.",
    status: "APPROVED",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "post-2",
    community: mockCommunity,
    author: { ...mockAuthor, id: "preview-user-2", fullName: "Priya Nair" },
    postType: "GENERAL",
    title: "Weekend clean-up volunteers",
    content: "We are organizing a short clean-up drive near the clubhouse. Join in if you can spare 30 minutes.",
    status: "APPROVED",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function FeedTabScreen() {
  const notificationCount = useUnreadNotificationCount();
  const posts = useMemo(() => previewPosts, []);

  return (
    <View style={styles.root}>
      <AppHeader
        title="Community Connect"
        notificationCount={notificationCount}
        onSearchPress={() => router.push("/community/search")}
        onNotificationsPress={() => router.push("/tabs/notifications")}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.statusCard}>
          <UserAvatar name="You" />
          <Pressable style={styles.statusInput} onPress={() => router.push("/posts/create")}>
            <Text style={styles.statusInputText} numberOfLines={1}>
              Share an update with your community
            </Text>
          </Pressable>
        </View>

        <SearchInput placeholder="Search posts and communities" />

        <View style={styles.communityCard}>
          <View style={styles.communityHeader}>
            <View>
              <Text style={styles.communityName} numberOfLines={1}>
                {mockCommunity.name}
              </Text>
              <Text style={styles.communityMeta} numberOfLines={1}>
                {mockCommunity.city}, {mockCommunity.state} • {mockCommunity.memberCount} members
              </Text>
            </View>
            <StatusBadge label="Active" tone="success" />
          </View>
          <View style={styles.quickRow}>
            <Pressable style={styles.quickButton} onPress={() => router.push("/community/search")}>
              <MaterialIcons name="groups" size={18} color={colors.primary} />
              <Text style={styles.quickButtonText}>Directory</Text>
            </Pressable>
            <Pressable style={styles.quickButton} onPress={() => router.push("/events/list")}>
              <MaterialIcons name="event" size={18} color={colors.primary} />
              <Text style={styles.quickButtonText}>Events</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Feed</Text>
          <Pressable onPress={() => router.push("/posts/my-posts")}>
            <Text style={styles.sectionAction}>My posts</Text>
          </Pressable>
        </View>

        {posts.map((post) => (
          <PostCard key={post.id} post={post} showStatus={false} onPress={() => router.push("/posts/details")} />
        ))}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push("/posts/create")} accessibilityRole="button">
        <MaterialIcons name="edit" size={26} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    padding: spacing.containerPadding,
    paddingBottom: 112,
    gap: spacing.gutter
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.gutter,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(191, 200, 197, 0.65)",
    backgroundColor: colors.surfaceContainerLowest,
    ...shadows.card
  },
  statusInput: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.full,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainerLow
  },
  statusInputText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontFamily: typography.family
  },
  communityCard: {
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primaryContainer
  },
  communityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  communityName: {
    ...typography.bodyLgStrong,
    color: colors.onPrimary,
    fontFamily: typography.familyBold
  },
  communityMeta: {
    ...typography.bodyMd,
    marginTop: 2,
    color: "rgba(255, 255, 255, 0.78)",
    fontFamily: typography.family
  },
  quickRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  quickButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.surfaceContainerLowest
  },
  quickButtonText: {
    ...typography.labelMd,
    color: colors.primary,
    fontFamily: typography.familySemiBold
  },
  sectionHeader: {
    marginTop: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
    fontFamily: typography.familyBold
  },
  sectionAction: {
    ...typography.bodyMd,
    color: colors.primary,
    fontFamily: typography.familySemiBold
  },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.xl,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentGreen,
    ...shadows.button
  }
});
