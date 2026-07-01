import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { DashboardLayout, WebAvatar, WebBadge, WebButton, WebCard, WebSelect, WebTextarea } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { accessRequestService } from "@/services/access-request.service";
import { communityService } from "@/services/community.service";
import { AccessRequest, CommunitySummary } from "@/types";

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

export default function AdminAccessRequestsScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 820;
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [activeCommunity, setActiveCommunity] = useState<CommunitySummary | null>(null);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [rejecting, setRejecting] = useState<AccessRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const loadCommunities = async () => {
    setLoading(true);
    setToast(null);
    try {
      const communityItems = await communityService.search("");
      setCommunities(communityItems);
      for (const community of communityItems) {
        try {
          const pendingRequests = await accessRequestService.byCommunity(community.id, "PENDING");
          setActiveCommunity(community);
          setRequests(pendingRequests);
          return;
        } catch {
          // Try the next community; the current admin may not manage this one.
        }
      }
      setActiveCommunity(null);
      setRequests([]);
    } catch (error) {
      setToast({ tone: "error", message: apiError(error, "Unable to load access requests.") });
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async (community: CommunitySummary) => {
    setActiveCommunity(community);
    setLoading(true);
    setToast(null);
    try {
      setRequests(await accessRequestService.byCommunity(community.id, "PENDING"));
    } catch (error) {
      setToast({ tone: "error", message: apiError(error, "Unable to load access requests.") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  const approve = async (request: AccessRequest) => {
    setReviewingId(request.id);
    setToast(null);
    try {
      await accessRequestService.approve(request.id);
      setRequests((current) => current.filter((item) => item.id !== request.id));
      setToast({ tone: "success", message: `${request.user.fullName} was approved and notified.` });
    } catch (error) {
      setToast({ tone: "error", message: apiError(error, "Unable to approve request.") });
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
      await accessRequestService.reject(rejecting.id, rejectionReason.trim() || "Request rejected by admin.");
      setRequests((current) => current.filter((item) => item.id !== rejecting.id));
      setToast({ tone: "success", message: `${rejecting.user.fullName} was rejected and notified.` });
      setRejecting(null);
      setRejectionReason("");
    } catch (error) {
      setToast({ tone: "error", message: apiError(error, "Unable to reject request.") });
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <DashboardLayout title="Access Requests" nav={["Dashboard", "Access Requests", "Post Approvals", "Members", "Events", "Settings"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>Pending requests</Text>
            <Text style={styles.muted}>Approve verified members or reject with a reason.</Text>
          </View>
          {communities.length > 0 ? (
            <WebSelect label="Community" value={activeCommunity?.name ?? "Select community"} onPress={() => activeCommunity && loadRequests(activeCommunity)} />
          ) : null}
        </View>

        {toast ? <Text style={[styles.toast, toast.tone === "success" ? styles.toastSuccess : styles.toastError]}>{toast.message}</Text> : null}
        {loading ? <LoadingState message="Loading access requests" /> : null}
        {!loading && requests.length === 0 ? <EmptyState title="No pending requests" message="New access requests will appear here." /> : null}

        {!loading && requests.length > 0 ? (
          <WebCard style={styles.list}>
            {requests.map((request) => (
              <View key={request.id} style={[styles.row, compact ? styles.rowCompact : null]}>
                <WebAvatar name={request.user.fullName} />
                <View style={styles.userCell}>
                  <Text style={styles.rowTitle}>{request.user.fullName}</Text>
                  <Text style={styles.muted}>{request.user.email} / {request.user.mobile}</Text>
                </View>
                <Text style={styles.message}>{request.requestMessage || "No request message provided."}</Text>
                <Text style={styles.date}>{formatDate(request.createdAt)}</Text>
                <WebBadge label={request.status} tone="warning" />
                <View style={[styles.actions, compact ? styles.actionsCompact : null]}>
                  <WebButton label={reviewingId === request.id ? "Approving..." : "Approve"} onPress={() => approve(request)} />
                  <WebButton label="Reject" variant="danger" onPress={() => setRejecting(request)} />
                </View>
              </View>
            ))}
          </WebCard>
        ) : null}
      </ScrollView>

      <Modal visible={Boolean(rejecting)} transparent animationType="fade" onRequestClose={() => setRejecting(null)}>
        <View style={styles.modalBackdrop}>
          <WebCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reject request</Text>
            <Text style={styles.muted}>Add a readable reason for {rejecting?.user.fullName}. The user will receive a notification.</Text>
            <WebTextarea label="Rejection reason" placeholder="Explain why this request cannot be approved" value={rejectionReason} onChangeText={setRejectionReason} />
            <View style={styles.modalActions}>
              <WebButton label="Cancel" variant="secondary" onPress={() => setRejecting(null)} />
              <WebButton label={reviewingId ? "Rejecting..." : "Reject Request"} variant="danger" onPress={reject} />
            </View>
          </WebCard>
        </View>
      </Modal>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  headerRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap" },
  heading: { ...typography.headlineMd, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  toast: { borderRadius: radius.default, padding: spacing.md, textAlign: "center", fontWeight: "700" },
  toastSuccess: { color: colors.success, backgroundColor: "#dcfce7" },
  toastError: { color: colors.error, backgroundColor: colors.errorContainer },
  list: { padding: 0, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  rowCompact: { alignItems: "stretch", flexDirection: "column" },
  userCell: { minWidth: 210, flex: 1 },
  rowTitle: { color: colors.onSurface, fontWeight: "800" },
  message: { flex: 1.3, color: colors.onSurfaceVariant, lineHeight: 21 },
  date: { width: 150, color: colors.textGrey, fontWeight: "700" },
  actions: { flexDirection: "row", gap: spacing.sm },
  actionsCompact: { width: "100%", flexWrap: "wrap" },
  modalBackdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.md, backgroundColor: "rgba(0,0,0,0.35)" },
  modalCard: { width: "100%", maxWidth: 520, gap: spacing.md },
  modalTitle: { ...typography.headlineSm, color: colors.onSurface, fontFamily: typography.familyBold },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm, flexWrap: "wrap" }
});
