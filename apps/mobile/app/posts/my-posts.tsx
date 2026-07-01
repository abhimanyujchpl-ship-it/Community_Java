import { MaterialIcons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardLayout, WebAvatar, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { postService } from "@/services/post.service";
import { CommunityPost, PostStatus, PostType } from "@/types";

const statusLabels: Record<PostStatus, string> = {
  DRAFT: "Draft",
  PENDING_APPROVAL: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DELETED: "Deleted"
};

const typeLabels: Record<PostType, string> = {
  ANNOUNCEMENT: "Announcement",
  GENERAL: "General Post",
  EVENT_UPDATE: "Event Update",
  NEWS: "News",
  BIRTHDAY_WISH: "Birthday / Wishes",
  MATRIMONY: "Matrimony",
  DONATION_REQUEST: "Donation / Support"
};

function statusTone(status: PostStatus) {
  if (status === "APPROVED") {
    return "success" as const;
  }
  if (status === "REJECTED") {
    return "danger" as const;
  }
  if (status === "PENDING_APPROVAL") {
    return "warning" as const;
  }
  return "neutral" as const;
}

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

export default function MyPostsScreen() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        setPosts(await postService.mine());
      } catch (requestError) {
        setError(apiError(requestError, "Unable to load your posts."));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <DashboardLayout
      title="My Posts"
      nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}
      right={
        <WebCard style={styles.stack}>
          <Text style={styles.panelTitle}>Post review</Text>
          <Text style={styles.muted}>Pending posts become visible in the feed only after admin approval.</Text>
          <WebButton label="Create Post" onPress={() => router.push("/posts/create")} />
        </WebCard>
      }
    >
      <ScrollView contentContainerStyle={styles.page}>
        {loading ? <LoadingState message="Loading your posts" /> : null}
        {!loading && error ? <EmptyState title="Posts unavailable" message={error} icon="error-outline" /> : null}
        {!loading && !error && posts.length === 0 ? <EmptyState title="No posts yet" message="Create a post from an approved community." /> : null}
        {!loading && !error && posts.map((post) => (
          <WebCard key={post.id} style={styles.post}>
            <View style={styles.header}>
              <WebAvatar name={post.author.fullName} />
              <View style={{ flex: 1 }}>
                <Text style={styles.author}>{post.author.fullName}</Text>
                <Text style={styles.muted}>{post.community.name} / {formatDate(post.createdAt)}</Text>
              </View>
              <WebBadge label={statusLabels[post.status]} tone={statusTone(post.status)} />
            </View>
            <View style={styles.metaRow}>
              <WebBadge label={typeLabels[post.postType]} />
              <Text style={styles.muted}>Updated {formatDate(post.updatedAt)}</Text>
            </View>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.muted}>{post.content}</Text>
            {post.rejectionReason ? (
              <View style={styles.rejection}>
                <MaterialIcons name="report" size={20} color={colors.error} />
                <Text style={styles.rejectionText}>Rejected: {post.rejectionReason}</Text>
              </View>
            ) : null}
          </WebCard>
        ))}
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  stack: { gap: spacing.md },
  post: { gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  author: { color: colors.onSurface, fontWeight: "800" },
  title: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  panelTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  rejection: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderRadius: radius.default, padding: spacing.md, backgroundColor: colors.errorContainer },
  rejectionText: { color: colors.error, fontWeight: "700", flex: 1 }
});
