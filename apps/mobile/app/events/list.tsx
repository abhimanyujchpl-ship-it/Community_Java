import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { EventCard } from "@/components/cards/EventCard";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { eventService } from "@/services/event.service";
import { CommunityEvent } from "@/types";

export default function EventListScreen() {
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
      .byCommunity(communityId)
      .then(setEvents)
      .catch(() => setError("Unable to load events."))
      .finally(() => setLoading(false));
  }, [communityId]);

  return (
    <>
      <AppHeader title="Events" showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading events" /> : null}
        {!loading && error ? <EmptyState title="Events unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && !error && events.length === 0 ? <EmptyState title="No events yet" message="Community events will appear here." /> : null}
        <View className="gap-3">
          {!loading &&
            !error &&
            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push({ pathname: "/events/details", params: { eventId: event.id } })}
              />
            ))}
        </View>
      </ScreenContainer>
    </>
  );
}
