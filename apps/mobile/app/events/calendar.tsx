import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { EventCard } from "@/components/cards/EventCard";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { eventService } from "@/services/event.service";
import { CommunityEvent } from "@/types";

export default function EventCalendarScreen() {
  const { communityId } = useLocalSearchParams<{ communityId?: string }>();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!communityId) {
      setError("Community was not selected.");
      setLoading(false);
      return;
    }

    eventService
      .upcoming(communityId)
      .then(setEvents)
      .catch(() => setError("Unable to load calendar events."))
      .finally(() => setLoading(false));
  }, [communityId]);

  const grouped = useMemo(() => {
    return events.reduce<Record<string, CommunityEvent[]>>((acc, event) => {
      const key = new Date(event.startDateTime).toLocaleDateString();
      acc[key] = [...(acc[key] ?? []), event];
      return acc;
    }, {});
  }, [events]);

  return (
    <>
      <AppHeader title="Calendar" showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading calendar" /> : null}
        {!loading && error ? <EmptyState title="Calendar unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && !error && events.length === 0 ? <EmptyState title="No upcoming events" /> : null}
        {!loading &&
          !error &&
          Object.entries(grouped).map(([date, items]) => (
            <View key={date} className="mb-5 gap-3">
              <View className="rounded-xl bg-primary px-4 py-3">
                <Text className="text-base font-bold text-white">{date}</Text>
              </View>
              {items.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => router.push({ pathname: "/events/details", params: { eventId: event.id } })}
                />
              ))}
            </View>
          ))}
      </ScreenContainer>
    </>
  );
}
