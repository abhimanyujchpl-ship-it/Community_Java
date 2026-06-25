import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/headers/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { eventService } from "@/services/event.service";

export default function CreateEventScreen() {
  const { communityId, eventId } = useLocalSearchParams<{ communityId?: string; eventId?: string }>();
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventId) {
      return;
    }

    eventService.details(eventId).then((event) => {
      setTitle(event.title);
      setEventType(event.eventType);
      setDescription(event.description ?? "");
      setBannerUrl(event.bannerUrl ?? "");
      setLocation(event.location);
      setStartDateTime(event.startDateTime);
      setEndDateTime(event.endDateTime);
      setOrganizerName(event.organizerName ?? "");
    });
  }, [eventId]);

  const submit = async () => {
    if (!communityId && !eventId) {
      Alert.alert("Community required", "Select a community before creating an event.");
      return;
    }
    if (!title.trim() || !eventType.trim() || !location.trim() || !startDateTime.trim() || !endDateTime.trim()) {
      Alert.alert("Missing details", "Title, type, location, start, and end date/time are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        eventType: eventType.trim(),
        description: description.trim() || undefined,
        bannerUrl: bannerUrl.trim() || undefined,
        location: location.trim(),
        startDateTime: new Date(startDateTime).toISOString(),
        endDateTime: new Date(endDateTime).toISOString(),
        organizerName: organizerName.trim() || undefined
      };
      const event = eventId ? await eventService.update(eventId, payload) : await eventService.create({ communityId: communityId!, ...payload });
      Alert.alert(eventId ? "Event updated" : "Event created", eventId ? "Your changes were saved." : "Members will receive a notification record.");
      router.replace({ pathname: "/events/details", params: { eventId: event.id } });
    } catch {
      Alert.alert("Event not created", "Only admins can create events, and end date cannot be before start date.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader title={eventId ? "Edit Event" : "Create Event"} showNotifications={false} />
      <ScreenContainer>
        <View className="gap-4 rounded-xl border border-border bg-white p-4">
          <TextField label="Title" value={title} onChangeText={setTitle} placeholder="Community meeting" />
          <TextField label="Event type" value={eventType} onChangeText={setEventType} placeholder="Meeting, celebration, sports" />
          <TextField label="Location" value={location} onChangeText={setLocation} placeholder="Clubhouse hall" />
          <TextField label="Start date/time" value={startDateTime} onChangeText={setStartDateTime} placeholder="2026-07-01 18:00" />
          <TextField label="End date/time" value={endDateTime} onChangeText={setEndDateTime} placeholder="2026-07-01 20:00" />
          <TextField label="Organizer" value={organizerName} onChangeText={setOrganizerName} placeholder="Optional" />
          <TextField label="Banner URL" value={bannerUrl} onChangeText={setBannerUrl} placeholder="Optional image URL" />
          <TextField label="Description" value={description} onChangeText={setDescription} placeholder="Event details" multiline />
          <PrimaryButton label={eventId ? "Save event" : "Create event"} loading={submitting} onPress={submit} />
        </View>
      </ScreenContainer>
    </>
  );
}
