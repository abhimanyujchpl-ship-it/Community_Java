import { MaterialIcons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { DashboardLayout, StatCard, WebAvatar, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { accessRequestService } from "@/services/access-request.service";
import { postService } from "@/services/post.service";
import { useCommunityStore } from "@/store/community.store";
import { CommunityPost, CommunitySummary, PostType } from "@/types";
import { findApprovedRequest } from "@/utils/communityAccess";

const postTypes: Array<{ label: string; value: PostType | "ALL" }> = [
  { label: "All", value: "ALL" },
  { label: "Announcement", value: "ANNOUNCEMENT" },
  { label: "General Post", value: "GENERAL" },
  { label: "Event Update", value: "EVENT_UPDATE" },
  { label: "News", value: "NEWS" },
  { label: "Birthday / Wishes", value: "BIRTHDAY_WISH" },
  { label: "Donation / Support", value: "DONATION_REQUEST" }
];

const typeLabels: Record<PostType, string> = {
  ANNOUNCEMENT: "Announcement",
  GENERAL: "General Post",
  EVENT_UPDATE: "Event Update",
  NEWS: "News",
  BIRTHDAY_WISH: "Birthday / Wishes",
  MATRIMONY: "Matrimony",
  DONATION_REQUEST: "Donation / Support"
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

export default function FeedPage() {
  const { width } = useWindowDimensions();
  const { communityId: routeCommunityId } = useLocalSearchParams<{ communityId?: string }>();
  const activeCommunity = useCommunityStore((state) => state.activeCommunity);
  const setActiveCommunity = useCommunityStore((state) => state.setActiveCommunity);
  const [community, setCommunity] = useState<CommunitySummary | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedType, setSelectedType] = useState<PostType | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const compact = width < 760;

  const communityId = routeCommunityId ?? activeCommunity?.id ?? community?.id;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const requests = await accessRequestService.mine();
      const approved = findApprovedRequest(requests, routeCommunityId ?? activeCommunity?.id);
      if (!approved) {
        setCommunity(null);
        setPosts([]);
        return;
      }

      setCommunity(approved.community);
      setActiveCommunity(approved.community);
      setPosts(await postService.feed(approved.community.id, selectedType === "ALL" ? undefined : selectedType));
    } catch (requestError) {
      setError(apiError(requestError, "Unable to load community feed."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [routeCommunityId, activeCommunity?.id, selectedType]);

  const filteredPosts = useMemo(() => posts.filter((post) => post.status === "APPROVED"), [posts]);

  return (
    <DashboardLayout
      title="Community Feed"
      nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}
      right={
        <>
          <WebCard style={styles.stack}>
            <Text style={styles.panelTitle}>Community</Text>
            <Text style={styles.muted}>{community?.name ?? "No approved community selected"}</Text>
            <WebButton label="Browse Communities" variant="secondary" onPress={() => router.push("/community/search")} />
          </WebCard>
          <WebCard style={styles.stack}>
            <Text style={styles.panelTitle}>Quick actions</Text>
            <WebButton label="Create Post" icon="edit" disabled={!communityId} onPress={() => router.push({ pathname: "/posts/create", params: { communityId } })} />
            <WebButton label="My Posts" variant="secondary" onPress={() => router.push("/posts/my-posts")} />
          </WebCard>
        </>
      }
    >
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.stats}>
          <StatCard label="Approved Posts" value={String(filteredPosts.length)} icon="forum" />
          <StatCard label="Unread Alerts" value="-" icon="notifications" />
          <StatCard label="Upcoming Events" value="-" icon="event" />
        </View>

        <WebCard style={[styles.composer, compact ? styles.composerCompact : null]}>
          <WebAvatar name="You" />
          <View style={styles.composerInput}><Text style={styles.muted}>Share an update with your community</Text></View>
          <WebButton label="Create Post" icon="edit" disabled={!communityId} onPress={() => router.push({ pathname: "/posts/create", params: { communityId } })} />
        </WebCard>

        <WebCard style={styles.filters}>
          {postTypes.map((type) => (
            <Pressable key={type.value} style={[styles.chip, selectedType === type.value ? styles.chipActive : null]} onPress={() => setSelectedType(type.value)}>
              <Text style={[styles.chipText, selectedType === type.value ? styles.chipTextActive : null]}>{type.label}</Text>
            </Pressable>
          ))}
        </WebCard>

        {loading ? <LoadingState message="Loading feed" /> : null}
        {!loading && error ? <EmptyState title="Feed unavailable" message={error} icon="lock" /> : null}
        {!loading && !error && !community ? <EmptyState title="No approved community" message="Request access to a community before opening the feed." /> : null}
        {!loading && !error && community && filteredPosts.length === 0 ? <EmptyState title="No approved posts" message="Approved posts will appear here after admin review." /> : null}

        {!loading && !error && filteredPosts.map((post) => (
          <WebCard key={post.id} style={styles.post}>
            <View style={styles.postHeader}>
              <WebAvatar name={post.author.fullName} />
              <View style={{ flex: 1 }}>
                <Text style={styles.author}>{post.author.fullName}</Text>
                <Text style={styles.muted}>{formatDate(post.createdAt)}</Text>
              </View>
              <WebBadge label={typeLabels[post.postType]} />
            </View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.muted} numberOfLines={3}>{post.content}</Text>
            <View style={styles.media}>
              <MaterialIcons name={post.mediaUrl ? "image" : "perm-media"} size={28} color={colors.primary} />
              <Text style={styles.muted}>{post.mediaUrl ? "Media attached" : "Media placeholder"}</Text>
            </View>
            <View style={styles.postActions}>
              <Text style={styles.action}>Like</Text>
              <Text style={styles.action}>Comment</Text>
            </View>
          </WebCard>
        ))}
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  stats: { flexDirection: "row", gap: spacing.md, flexWrap: "wrap" },
  stack: { gap: spacing.md },
  panelTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  composer: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  composerCompact: { alignItems: "stretch", flexDirection: "column" },
  composerInput: { flex: 1, minHeight: 46, borderRadius: radius.full, justifyContent: "center", paddingHorizontal: spacing.md, backgroundColor: colors.surfaceContainerLow },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.surfaceContainerLow },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.primary, fontWeight: "800" },
  chipTextActive: { color: colors.onPrimary },
  post: { gap: spacing.md },
  postHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  author: { color: colors.onSurface, fontWeight: "800" },
  postTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  media: { height: 150, borderRadius: radius.md, alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.surfaceContainerLow },
  postActions: { flexDirection: "row", gap: spacing.lg, borderTopWidth: 1, borderTopColor: colors.outlineVariant, paddingTop: spacing.md },
  action: { color: colors.primary, fontWeight: "800" }
});

