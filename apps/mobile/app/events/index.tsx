import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { DashboardLayout, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { accessRequestService } from "@/services/access-request.service";
import { eventService } from "@/services/event.service";
import { useCommunityStore } from "@/store/community.store";
import { CommunityEvent, EventStatus } from "@/types";
import { findApprovedRequest } from "@/utils/communityAccess";

const filters: Array<{ label: string; value?: EventStatus }> = [
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" }
];

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

export default function EventsPage() {
  const { width } = useWindowDimensions();
  const { communityId: routeCommunityId } = useLocalSearchParams<{ communityId?: string }>();
  const activeCommunity = useCommunityStore((state) => state.activeCommunity);
  const setActiveCommunity = useCommunityStore((state) => state.setActiveCommunity);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [status, setStatus] = useState<EventStatus>("UPCOMING");
  const [communityName, setCommunityName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const compact = width < 800;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const requests = await accessRequestService.mine();
        const approved = findApprovedRequest(requests, routeCommunityId ?? activeCommunity?.id);
        if (!approved) {
          setEvents([]);
          setCommunityName(null);
          return;
        }
        setActiveCommunity(approved.community);
        setCommunityName(approved.community.name);
        setEvents(await eventService.byCommunity(approved.community.id, status));
      } catch (requestError) {
        setError(apiError(requestError, "Unable to load events."));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeCommunity?.id, routeCommunityId, setActiveCommunity, status]);

  return (
    <DashboardLayout title="Events" nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={[styles.headerRow, compact ? styles.headerCompact : null]}>
          <View>
            <Text style={styles.heading}>{status === "UPCOMING" ? "Upcoming Events" : `${status[0]}${status.slice(1).toLowerCase()} Events`}</Text>
            <Text style={styles.muted}>{communityName ?? "Select an approved community to view events."}</Text>
          </View>
          <View style={styles.headerActions}>
            <WebButton label="Calendar" variant="secondary" icon="calendar-month" onPress={() => router.push("/events/calendar")} />
            <WebButton label="Create Event" icon="add" onPress={() => router.push("/events/create")} />
          </View>
        </View>

        <WebCard style={styles.filters}>
          {filters.map((filter) => (
            <Pressable key={filter.label} style={[styles.chip, status === filter.value ? styles.chipActive : null]} onPress={() => filter.value && setStatus(filter.value)}>
              <Text style={[styles.chipText, status === filter.value ? styles.chipTextActive : null]}>{filter.label}</Text>
            </Pressable>
          ))}
        </WebCard>

        {loading ? <LoadingState message="Loading events" /> : null}
        {!loading && error ? <EmptyState title="Events unavailable" message={error} icon="event-busy" /> : null}
        {!loading && !error && events.length === 0 ? <EmptyState title="No events found" message="Events will appear here after admins create them." icon="event" /> : null}

        <View style={styles.grid}>
          {!loading && !error && events.map((event) => {
            const parts = dateParts(event.startDateTime);
            return (
              <WebCard key={event.id} style={styles.eventCard}>
                <View style={styles.dateBlock}>
                  <Text style={styles.month}>{parts.month}</Text>
                  <Text style={styles.day}>{parts.day}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.muted}>{parts.time}</Text>
                  <Text style={styles.muted}>{event.location}</Text>
                  <Text style={styles.muted}>Organizer: {event.organizerName ?? event.createdBy.fullName}</Text>
                </View>
                <WebBadge label={event.status} tone={statusTone(event.status)} />
                <WebButton label="View Details" variant="secondary" onPress={() => router.push({ pathname: "/events/details", params: { eventId: event.id } })} />
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  headerCompact: { alignItems: "stretch", flexDirection: "column" },
  headerActions: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  heading: { ...typography.headlineMd, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, marginTop: 4, lineHeight: 21 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.surfaceContainerLow },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.primary, fontWeight: "800" },
  chipTextActive: { color: colors.onPrimary },
  grid: { gap: spacing.md },
  eventCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, flexWrap: "wrap" },
  dateBlock: { width: 64, height: 72, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  month: { color: colors.accentGreen, fontWeight: "800", textTransform: "uppercase" },
  day: { color: colors.onPrimary, fontSize: 26, fontWeight: "900" },
  eventTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold }
});

