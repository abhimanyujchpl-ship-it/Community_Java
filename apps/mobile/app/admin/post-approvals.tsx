import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { DashboardLayout, WebAvatar, WebBadge, WebButton, WebCard, WebTextarea } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { communityService } from "@/services/community.service";
import { postService } from "@/services/post.service";
import { CommunityPost, CommunitySummary, PostType } from "@/types";

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

export default function AdminPostApprovalsScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = width >= 1100 ? "48.5%" : "100%";
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [activeCommunity, setActiveCommunity] = useState<CommunitySummary | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [rejecting, setRejecting] = useState<CommunityPost | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setToast(null);
    try {
      const communityItems = await communityService.search("");
      setCommunities(communityItems);
      for (const community of communityItems) {
        try {
          const pendingPosts = await postService.pending(community.id);
          setActiveCommunity(community);
          setPosts(pendingPosts);
          return;
        } catch {
          // Try another community; this admin may not manage the current one.
        }
      }
      setActiveCommunity(null);
      setPosts([]);
    } catch (requestError) {
      setToast({ tone: "error", message: apiError(requestError, "Unable to load pending posts.") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (post: CommunityPost) => {
    setReviewingId(post.id);
    setToast(null);
    try {
      await postService.approve(post.id);
      setPosts((current) => current.filter((item) => item.id !== post.id));
      setToast({ tone: "success", message: `"${post.title}" was approved and is now visible in the feed.` });
    } catch (requestError) {
      setToast({ tone: "error", message: apiError(requestError, "Unable to approve post.") });
    } finally {
      setReviewingId(null);
    }
  };

  const reject = async () => {
    if (!rejecting) {
      return;
    }

    setReviewingId(rejecting.id);
    setToast(null);
    try {
      await postService.reject(rejecting.id, rejectionReason.trim() || "Post does not meet community guidelines.");
      setPosts((current) => current.filter((item) => item.id !== rejecting.id));
      setToast({ tone: "success", message: `"${rejecting.title}" was rejected and the author was notified.` });
      setRejecting(null);
      setRejectionReason("");
    } catch (requestError) {
      setToast({ tone: "error", message: apiError(requestError, "Unable to reject post.") });
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <DashboardLayout title="Post Approvals" nav={["Dashboard", "Access Requests", "Post Approvals", "Members", "Events", "Settings"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>Pending post approvals</Text>
            <Text style={styles.muted}>{activeCommunity ? `Reviewing ${activeCommunity.name}` : "Pending posts from communities you administer."}</Text>
          </View>
          <WebButton label="Refresh" variant="secondary" onPress={load} />
        </View>

        {toast ? <Text style={[styles.toast, toast.tone === "success" ? styles.toastSuccess : styles.toastError]}>{toast.message}</Text> : null}
        {loading ? <LoadingState message="Loading pending posts" /> : null}
        {!loading && posts.length === 0 ? <EmptyState title="No pending posts" message="Submitted posts will appear here for review." /> : null}

        <View style={styles.grid}>
          {!loading && posts.map((post) => (
            <WebCard key={post.id} style={[styles.card, { width: cardWidth }]}>
              <View style={styles.header}>
                <WebAvatar name={post.author.fullName} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.author}>{post.author.fullName}</Text>
                  <Text style={styles.muted}>{post.author.email} / {formatDate(post.createdAt)}</Text>
                </View>
                <WebBadge label={typeLabels[post.postType]} />
              </View>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.muted}>{post.content}</Text>
              <View style={styles.media}><Text style={styles.muted}>{post.mediaUrl ? "Media attached" : "Media preview"}</Text></View>
              <View style={styles.actions}>
                <WebButton label={reviewingId === post.id ? "Approving..." : "Approve"} icon="check" onPress={() => approve(post)} />
                <WebButton label="Reject" variant="danger" icon="close" onPress={() => setRejecting(post)} />
              </View>
            </WebCard>
          ))}
        </View>
      </ScrollView>

      <Modal visible={Boolean(rejecting)} transparent animationType="fade" onRequestClose={() => setRejecting(null)}>
        <View style={styles.modalBackdrop}>
          <WebCard style={styles.modalCard}>
            <Text style={styles.heading}>Reject post</Text>
            <Text style={styles.muted}>Add a clear reason for {rejecting?.author.fullName}. This will be saved and sent as a notification.</Text>
            <WebTextarea label="Rejection reason" placeholder="Explain what needs to change" value={rejectionReason} onChangeText={setRejectionReason} />
            <View style={styles.modalActions}>
              <WebButton label="Cancel" variant="secondary" onPress={() => setRejecting(null)} />
              <WebButton label={reviewingId ? "Rejecting..." : "Reject Post"} variant="danger" onPress={reject} />
            </View>
          </WebCard>
        </View>
      </Modal>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap" },
  heading: { ...typography.headlineMd, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  toast: { borderRadius: radius.default, padding: spacing.md, textAlign: "center", fontWeight: "700" },
  toastSuccess: { color: colors.success, backgroundColor: "#dcfce7" },
  toastError: { color: colors.error, backgroundColor: colors.errorContainer },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  card: { minWidth: 320, gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  author: { color: colors.onSurface, fontWeight: "800" },
  title: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  media: { height: 120, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceContainerLow },
  actions: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  modalBackdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.md, backgroundColor: "rgba(0,0,0,0.35)" },
  modalCard: { width: "100%", maxWidth: 520, gap: spacing.md },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm, flexWrap: "wrap" }
});

