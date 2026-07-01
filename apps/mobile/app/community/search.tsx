import { MaterialIcons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { PublicNavbar, WebBadge, WebButton, WebCard, WebInput, WebSection, WebShell, WebTextarea } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { accessRequestService } from "@/services/access-request.service";
import { communityService } from "@/services/community.service";
import { useCommunityStore } from "@/store/community.store";
import { AccessRequest, CommunitySummary } from "@/types";

type Filter = "All" | "Popular" | "Pending" | "Approved";

const filters: Filter[] = ["All", "Popular", "Pending", "Approved"];

function apiError(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError.response) {
    return "Backend not reachable. Please start server on port 8080.";
  }
  return axiosError.response.data?.message ?? fallback;
}

function locationOf(community: CommunitySummary) {
  return [community.city, community.state].filter(Boolean).join(", ");
}

export default function CommunitySearchScreen() {
  const { width } = useWindowDimensions();
  const columns = width >= 1000 ? 3 : width >= 700 ? 2 : 1;
  const setActiveCommunity = useCommunityStore((state) => state.setActiveCommunity);
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<CommunitySummary | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setToast(null);
    try {
      const [communityItems, requestItems] = await Promise.all([communityService.search(""), accessRequestService.mine()]);
      setCommunities(communityItems);
      setRequests(requestItems);
    } catch (error) {
      setToast({ tone: "error", message: apiError(error, "Unable to load communities.") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const requestByCommunity = useMemo(() => {
    return new Map(requests.map((request) => [request.community.id, request]));
  }, [requests]);

  const visibleCommunities = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return communities
      .filter((community) => {
        const request = requestByCommunity.get(community.id);
        if (filter === "Pending" && request?.status !== "PENDING") {
          return false;
        }
        if (filter === "Approved" && request?.status !== "APPROVED") {
          return false;
        }
        if (filter === "Popular" && community.memberCount < 100) {
          return false;
        }
        if (!normalized) {
          return true;
        }
        return [community.name, community.description, community.city, community.state].filter(Boolean).some((value) => value!.toLowerCase().includes(normalized));
      });
  }, [communities, filter, query, requestByCommunity]);

  const submitRequest = async () => {
    if (!selected) {
      return;
    }

    setSubmitting(true);
    setToast(null);
    try {
      const created = await accessRequestService.create({
        communityId: selected.id,
        requestMessage: requestMessage.trim() || undefined
      });
      setRequests((current) => [created, ...current.filter((request) => request.community.id !== selected.id)]);
      setSelected(null);
      setRequestMessage("");
      setToast({ tone: "success", message: "Access request sent. Admins can review it now." });
    } catch (error) {
      setToast({ tone: "error", message: apiError(error, "Unable to submit access request.") });
    } finally {
      setSubmitting(false);
    }
  };

  const openDashboard = (community: CommunitySummary) => {
    setActiveCommunity(community);
    router.push({ pathname: "/dashboard/member", params: { communityId: community.id } });
  };

  return (
    <WebShell>
      <PublicNavbar onNavigate={(path) => router.push(path as never)} />
      <ScrollView>
        <WebSection>
          <View style={styles.header}>
            <Text style={styles.title}>Browse Communities</Text>
            <Text style={styles.subtitle}>Search verified communities, request access, and open your dashboard after approval.</Text>
          </View>

          <WebCard style={styles.searchCard}>
            <WebInput label="Search" placeholder="Search by name, city, or state" value={query} onChangeText={setQuery} />
            <View style={styles.chips}>
              {filters.map((chip) => (
                <Pressable key={chip} style={[styles.chip, filter === chip ? styles.chipActive : null]} onPress={() => setFilter(chip)}>
                  <Text style={[styles.chipText, filter === chip ? styles.chipTextActive : null]}>{chip}</Text>
                </Pressable>
              ))}
            </View>
          </WebCard>

          {toast ? <Text style={[styles.toast, toast.tone === "success" ? styles.toastSuccess : styles.toastError]}>{toast.message}</Text> : null}
          {loading ? <LoadingState message="Loading communities" /> : null}
          {!loading && !toast && visibleCommunities.length === 0 ? <EmptyState title="No communities found" message="Try another search or filter." /> : null}

          <View style={styles.grid}>
            {!loading &&
              visibleCommunities.map((community) => {
                const request = requestByCommunity.get(community.id);
                const cardWidth = columns === 3 ? "31.8%" : columns === 2 ? "48.5%" : "100%";
                return (
                  <WebCard key={community.id} style={[styles.card, { width: cardWidth }]}>
                    <View style={styles.cardTop}>
                      <View style={styles.avatar}>
                        <MaterialIcons name="groups" size={28} color={colors.onPrimary} />
                      </View>
                      <WebBadge label={request?.status ?? community.status} tone={request?.status === "PENDING" ? "warning" : request?.status === "APPROVED" ? "success" : "neutral"} />
                    </View>
                    <Text style={styles.cardTitle}>{community.name}</Text>
                    {community.description ? <Text style={styles.description}>{community.description}</Text> : null}
                    {locationOf(community) ? <Text style={styles.meta}>{locationOf(community)}</Text> : null}
                    <Text style={styles.members}>{community.memberCount} members</Text>
                    {request?.status === "APPROVED" ? (
                      <WebButton label="Open Dashboard" icon="dashboard" onPress={() => openDashboard(community)} />
                    ) : request?.status === "PENDING" ? (
                      <WebButton label="Request Pending" variant="secondary" icon="hourglass-empty" disabled />
                    ) : (
                      <WebButton label="Request Access" icon="login" onPress={() => setSelected(community)} />
                    )}
                  </WebCard>
                );
              })}
          </View>
        </WebSection>
      </ScrollView>

      <Modal visible={Boolean(selected)} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}>
          <WebCard style={styles.modalCard}>
            <Text style={styles.modalTitle}>Request access</Text>
            <Text style={styles.description}>Send a short note to the admins of {selected?.name}.</Text>
            <WebTextarea label="Request message" placeholder="Share why you want to join this community" value={requestMessage} onChangeText={setRequestMessage} />
            <View style={styles.modalActions}>
              <WebButton label="Cancel" variant="secondary" onPress={() => setSelected(null)} />
              <WebButton label={submitting ? "Submitting..." : "Submit Request"} onPress={submitRequest} />
            </View>
          </WebCard>
        </View>
      </Modal>
    </WebShell>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, paddingTop: 42, paddingBottom: spacing.lg },
  title: { fontSize: 38, fontWeight: "800", color: colors.onSurface, fontFamily: typography.familyExtraBold },
  subtitle: { fontSize: 17, color: colors.textGrey },
  searchCard: { gap: spacing.md },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderRadius: radius.full, paddingHorizontal: 16, paddingVertical: 9, backgroundColor: colors.surfaceContainerLow },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.primary, fontWeight: "800" },
  chipTextActive: { color: colors.onPrimary },
  toast: { marginTop: spacing.md, borderRadius: radius.default, padding: spacing.md, textAlign: "center", fontWeight: "700" },
  toastSuccess: { color: colors.success, backgroundColor: "#dcfce7" },
  toastError: { color: colors.error, backgroundColor: colors.errorContainer },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, paddingVertical: spacing.lg },
  card: { minWidth: 0, gap: spacing.md },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  avatar: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  cardTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  description: { color: colors.textGrey, lineHeight: 21 },
  meta: { color: colors.onSurfaceVariant, fontWeight: "700" },
  members: { color: colors.primary, fontWeight: "800" },
  modalBackdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.md, backgroundColor: "rgba(0,0,0,0.35)" },
  modalCard: { width: "100%", maxWidth: 520, gap: spacing.md },
  modalTitle: { ...typography.headlineSm, color: colors.onSurface, fontFamily: typography.familyBold },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm, flexWrap: "wrap" }
});
