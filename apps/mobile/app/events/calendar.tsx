import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import { CommunityEvent } from "@/types";
import { findApprovedRequest } from "@/utils/communityAccess";

function apiError(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError.response) {
    return "Backend not reachable. Please start server on port 8080.";
  }
  return axiosError.response.data?.message ?? fallback;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function monthDays(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export default function EventCalendarScreen() {
  const { width } = useWindowDimensions();
  const { communityId: routeCommunityId } = useLocalSearchParams<{ communityId?: string }>();
  const activeCommunity = useCommunityStore((state) => state.activeCommunity);
  const setActiveCommunity = useCommunityStore((state) => state.setActiveCommunity);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));
  const [communityName, setCommunityName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const compact = width < 900;

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
        setEvents(await eventService.byCommunity(approved.community.id));
      } catch (requestError) {
        setError(apiError(requestError, "Unable to load calendar events."));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeCommunity?.id, routeCommunityId, setActiveCommunity]);

  const eventsByDate = useMemo(() => {
    return events.reduce<Record<string, CommunityEvent[]>>((acc, event) => {
      const key = dateKey(new Date(event.startDateTime));
      acc[key] = [...(acc[key] ?? []), event];
      return acc;
    }, {});
  }, [events]);

  const selectedEvents = eventsByDate[selectedDate] ?? [];
  const days = monthDays(month);

  const moveMonth = (delta: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  return (
    <DashboardLayout title="Calendar" nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>Event Calendar</Text>
            <Text style={styles.muted}>{communityName ?? "Select an approved community to view calendar events."}</Text>
          </View>
          <WebButton label="Events" variant="secondary" onPress={() => router.push("/events")} />
        </View>

        {loading ? <LoadingState message="Loading calendar" /> : null}
        {!loading && error ? <EmptyState title="Calendar unavailable" message={error} icon="event-busy" /> : null}

        {!loading && !error ? (
          <View style={[styles.layout, compact ? styles.layoutCompact : null]}>
            <WebCard style={styles.calendar}>
              <View style={styles.monthNav}>
                <WebButton label="Prev" variant="secondary" onPress={() => moveMonth(-1)} />
                <Text style={styles.monthTitle}>{new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(month)}</Text>
                <WebButton label="Next" variant="secondary" onPress={() => moveMonth(1)} />
              </View>
              <View style={styles.weekRow}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <Text key={day} style={styles.weekday}>{day}</Text>)}
              </View>
              <View style={styles.dayGrid}>
                {days.map((day) => {
                  const key = dateKey(day);
                  const hasEvents = Boolean(eventsByDate[key]?.length);
                  const selected = selectedDate === key;
                  const outside = day.getMonth() !== month.getMonth();
                  return (
                    <Pressable key={key} style={[styles.dayCell, selected ? styles.daySelected : null, hasEvents ? styles.dayHasEvent : null]} onPress={() => setSelectedDate(key)}>
                      <Text style={[styles.dayText, outside ? styles.dayOutside : null, selected ? styles.daySelectedText : null]}>{day.getDate()}</Text>
                      {hasEvents ? <View style={styles.dot} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </WebCard>
            <WebCard style={styles.selectedPanel}>
              <Text style={styles.panelTitle}>{new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(new Date(selectedDate))}</Text>
              {selectedEvents.length === 0 ? <Text style={styles.muted}>No events on this date.</Text> : null}
              {selectedEvents.map((event) => (
                <View key={event.id} style={styles.eventItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.muted}>{new Intl.DateTimeFormat(undefined, { timeStyle: "short" }).format(new Date(event.startDateTime))} - {event.location}</Text>
                  </View>
                  <WebBadge label={event.status} tone={event.status === "CANCELLED" ? "danger" : event.status === "COMPLETED" ? "neutral" : "success"} />
                </View>
              ))}
            </WebCard>
          </View>
        ) : null}
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap" },
  heading: { ...typography.headlineMd, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  layout: { flexDirection: "row", gap: spacing.md },
  layoutCompact: { flexDirection: "column" },
  calendar: { flex: 1, gap: spacing.md },
  selectedPanel: { width: 340, gap: spacing.md },
  monthNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm, flexWrap: "wrap" },
  monthTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  weekRow: { flexDirection: "row" },
  weekday: { flex: 1, textAlign: "center", color: colors.textGrey, fontWeight: "800" },
  dayGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  dayCell: { width: "13.4%", minHeight: 58, borderRadius: radius.default, alignItems: "center", justifyContent: "center", gap: 4, backgroundColor: colors.surfaceContainerLow },
  dayHasEvent: { borderWidth: 1, borderColor: colors.accentGreen },
  daySelected: { backgroundColor: colors.primary },
  dayText: { color: colors.onSurface, fontWeight: "800" },
  dayOutside: { color: colors.outline },
  daySelectedText: { color: colors.onPrimary },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accentGreen },
  panelTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  eventItem: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.default, padding: spacing.md, backgroundColor: colors.surfaceContainerLow },
  eventTitle: { color: colors.onSurface, fontWeight: "800" }
});

