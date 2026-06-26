import { useEffect, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { LoadingState } from "@/components/common/LoadingState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { eventService } from "@/services/event.service";
import { CommunityEvent } from "@/types";
import { eventStatusTone } from "@/utils/eventStatus";
import { formatDate } from "@/utils/formatDate";

export default function EventDetailsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [event, setEvent] = useState<CommunityEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!eventId) {
      setError("Event was not selected.");
      setLoading(false);
      return;
    }
    eventService
      .details(eventId)
      .then(setEvent)
      .catch(() => setError("Unable to load event."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [eventId]);

  const cancel = async () => {
    if (!event) return;
    setSubmitting(true);
    try {
      setEvent(await eventService.cancel(event.id));
      Alert.alert("Cancelled", "The event is marked cancelled.");
    } catch {
      Alert.alert("Cancel failed", "Only admins can cancel events.");
    } finally {
      setSubmitting(false);
    }
  };

  const complete = async () => {
    if (!event) return;
    setSubmitting(true);
    try {
      setEvent(await eventService.complete(event.id));
      Alert.alert("Completed", "The event is marked completed.");
    } catch {
      Alert.alert("Complete failed", "Only admins can complete upcoming events.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader title="Event Details" showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading event" /> : null}
        {!loading && error ? <EmptyState title="Event unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && event ? (
          <View className="gap-4">
            <View className="overflow-hidden rounded-xl border border-border bg-white">
              {event.bannerUrl ? <Image source={{ uri: event.bannerUrl }} className="h-48 bg-lightBackground" /> : null}
              <View className="p-4">
                <View className="flex-row items-start justify-between gap-3">
                  <Text className="flex-1 text-2xl font-bold text-textDark">{event.title}</Text>
                  <StatusBadge label={event.status} tone={eventStatusTone(event.status)} />
                </View>
                <Text className="mt-3 text-sm font-semibold text-primary">{event.eventType}</Text>
                <Text className="mt-3 text-base font-semibold text-textDark">{formatDate(event.startDateTime)}</Text>
                <Text className="mt-1 text-sm text-textGrey">Ends {formatDate(event.endDateTime)}</Text>
                <Text className="mt-3 text-sm text-textGrey">{event.location}</Text>
                {event.organizerName ? <Text className="mt-1 text-sm text-textGrey">Organized by {event.organizerName}</Text> : null}
                {event.description ? <Text className="mt-4 text-sm leading-5 text-textDark">{event.description}</Text> : null}
              </View>
            </View>
            <View className="rounded-xl border border-border bg-white p-4">
              <Text className="text-base font-bold text-textDark">Reminders</Text>
              <Text className="mt-1 text-sm text-textGrey">
                {event.reminders.length
                  ? `${event.reminders.length} reminder records configured.`
                  : "No reminders configured yet."}
              </Text>
              {event.reminders.map((reminder) => (
                <Text key={reminder.id} className="mt-2 text-sm text-textDark">
                  {reminder.reminderType} · {formatDate(reminder.reminderDateTime)} · {reminder.isSent ? "Sent" : "Pending"}
                </Text>
              ))}
            </View>
            <PrimaryButton label="Set reminder" onPress={() => router.push({ pathname: "/events/reminder", params: { eventId: event.id } })} />
            <SecondaryButton label="Edit event" onPress={() => router.push({ pathname: "/events/create", params: { eventId: event.id } })} />
            <SecondaryButton label="Mark completed" disabled={submitting} onPress={complete} />
            <SecondaryButton label="Cancel event" disabled={submitting} onPress={cancel} />
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}
