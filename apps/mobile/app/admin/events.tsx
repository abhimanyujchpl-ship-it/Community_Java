import { AxiosError } from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardLayout, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { communityService } from "@/services/community.service";
import { eventService } from "@/services/event.service";
import { CommunityEvent, CommunitySummary, EventStatus } from "@/types";

function apiError(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError.response) {
    return "Backend not reachable. Please start server on port 8080.";
  }
  return axiosError.response.data?.message ?? fallback;
}

function dateParts(value: string) {
  const date = new Date(value);
  return {
    day: new Intl.DateTimeFormat(undefined, { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat(undefined, { month: "short" }).format(date),
    time: new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date)
  };
}

function statusTone(status: EventStatus) {
  if (status === "UPCOMING") {
    return "success" as const;
  }
  if (status === "CANCELLED") {
    return "danger" as const;
  }
  return "neutral" as const;
}

export default function AdminEventsScreen() {
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [activeCommunity, setActiveCommunity] = useState<CommunitySummary | null>(null);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setToast(null);
    try {
      const communityItems = await communityService.search("");
      setCommunities(communityItems);
      for (const community of communityItems) {
        try {
          const communityEvents = await eventService.byCommunity(community.id);
          setActiveCommunity(community);
          setEvents(communityEvents);
          return;
        } catch {
          // Try the next community; this admin may not manage the current one.
        }
      }
      setActiveCommunity(null);
      setEvents([]);
    } catch (requestError) {
      setToast({ tone: "error", message: apiError(requestError, "Unable to load events.") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (event: CommunityEvent, action: "cancel" | "complete") => {
    setActingId(event.id);
    setToast(null);
    try {
      const updated = action === "cancel" ? await eventService.cancel(event.id) : await eventService.complete(event.id);
      setEvents((current) => current.map((item) => item.id === event.id ? updated : item));
      setToast({ tone: "success", message: action === "cancel" ? "Event cancelled." : "Event marked completed." });
    } catch (requestError) {
      setToast({ tone: "error", message: apiError(requestError, "Unable to update event.") });
    } finally {
      setActingId(null);
    }
  };

  return (
    <DashboardLayout title="Admin Events" nav={["Dashboard", "Access Requests", "Post Approvals", "Members", "Events", "Settings"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>Manage events</Text>
            <Text style={styles.muted}>{activeCommunity ? `Managing ${activeCommunity.name}` : "Create, edit, cancel, and complete community events."}</Text>
          </View>
          <View style={styles.actions}>
            <WebButton label="Refresh" variant="secondary" onPress={load} />
            <WebButton label="Create Event" icon="add" disabled={!activeCommunity} onPress={() => router.push({ pathname: "/events/create", params: { communityId: activeCommunity?.id } })} />
          </View>
        </View>

        {toast ? <Text style={[styles.toast, toast.tone === "success" ? styles.toastSuccess : styles.toastError]}>{toast.message}</Text> : null}
        {loading ? <LoadingState message="Loading events" /> : null}
        {!loading && events.length === 0 ? <EmptyState title="No events found" message="Create an event to notify members." icon="event" /> : null}

        <View style={styles.grid}>
          {!loading && events.map((event) => {
            const parts = dateParts(event.startDateTime);
            return (
              <WebCard key={event.id} style={styles.card}>
                <View style={styles.dateBlock}>
                  <Text style={styles.month}>{parts.month}</Text>
                  <Text style={styles.day}>{parts.day}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.muted}>{parts.time} - {event.location}</Text>
                  <Text style={styles.muted}>Organizer: {event.organizerName ?? event.createdBy.fullName}</Text>
                </View>
                <WebBadge label={event.status} tone={statusTone(event.status)} />
                <View style={styles.actions}>
                  <WebButton label="Edit" variant="secondary" onPress={() => router.push({ pathname: "/events/create", params: { eventId: event.id, communityId: event.community.id } })} />
                  <WebButton label={actingId === event.id ? "Cancelling..." : "Cancel"} variant="danger" disabled={event.status === "CANCELLED"} onPress={() => updateStatus(event, "cancel")} />
                  <WebButton label={actingId === event.id ? "Saving..." : "Complete"} variant="secondary" disabled={event.status !== "UPCOMING"} onPress={() => updateStatus(event, "complete")} />
                </View>
              </WebCard>
            );
          })}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md, flexWrap: "wrap" },
  actions: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  heading: { ...typography.headlineMd, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, marginTop: 4, lineHeight: 21 },
  toast: { borderRadius: radius.default, padding: spacing.md, textAlign: "center", fontWeight: "700" },
  toastSuccess: { color: colors.success, backgroundColor: "#dcfce7" },
  toastError: { color: colors.error, backgroundColor: colors.errorContainer },
  grid: { gap: spacing.md },
  card: { flexDirection: "row", alignItems: "center", gap: spacing.md, flexWrap: "wrap" },
  dateBlock: { width: 64, height: 72, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  month: { color: colors.accentGreen, fontWeight: "800", textTransform: "uppercase" },
  day: { color: colors.onPrimary, fontSize: 26, fontWeight: "900" },
  eventTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold }
});

