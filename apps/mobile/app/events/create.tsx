import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { z } from "zod";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { eventService } from "@/services/event.service";

const eventSchema = z
  .object({
    title: z.string().min(2, "Title is required").max(180, "Title is too long"),
    eventType: z.string().min(2, "Event type is required").max(120, "Event type is too long"),
    description: z.string().optional(),
    bannerUrl: z.string().optional(),
    location: z.string().min(2, "Location is required").max(240, "Location is too long"),
    startDateTime: z.string().min(1, "Start date/time is required"),
    endDateTime: z.string().min(1, "End date/time is required"),
    organizerName: z.string().optional()
  })
  .refine((values) => !Number.isNaN(new Date(values.startDateTime).getTime()), {
    path: ["startDateTime"],
    message: "Use a valid date/time"
  })
  .refine((values) => !Number.isNaN(new Date(values.endDateTime).getTime()), {
    path: ["endDateTime"],
    message: "Use a valid date/time"
  })
  .refine((values) => new Date(values.endDateTime).getTime() >= new Date(values.startDateTime).getTime(), {
    path: ["endDateTime"],
    message: "End date cannot be before start date"
  });

type EventForm = z.infer<typeof eventSchema>;

export default function CreateEventScreen() {
  const { communityId, eventId } = useLocalSearchParams<{ communityId?: string; eventId?: string }>();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      eventType: "",
      description: "",
      bannerUrl: "",
      location: "",
      startDateTime: "",
      endDateTime: "",
      organizerName: ""
    }
  });

  useEffect(() => {
    if (!eventId) {
      return;
    }

    eventService.details(eventId).then((event) => {
      reset({
        title: event.title,
        eventType: event.eventType,
        description: event.description ?? "",
        bannerUrl: event.bannerUrl ?? "",
        location: event.location,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        organizerName: event.organizerName ?? ""
      });
    });
  }, [eventId, reset]);

  const submit = async (values: EventForm) => {
    if (!communityId && !eventId) {
      Alert.alert("Community required", "Select a community before creating an event.");
      return;
    }

    try {
      const payload = {
        title: values.title.trim(),
        eventType: values.eventType.trim(),
        description: values.description?.trim() || undefined,
        bannerUrl: values.bannerUrl?.trim() || undefined,
        location: values.location.trim(),
        startDateTime: new Date(values.startDateTime).toISOString(),
        endDateTime: new Date(values.endDateTime).toISOString(),
        organizerName: values.organizerName?.trim() || undefined
      };
      const event = eventId ? await eventService.update(eventId, payload) : await eventService.create({ communityId: communityId!, ...payload });
      Alert.alert(eventId ? "Event updated" : "Event created", eventId ? "Your changes were saved." : "Members will receive a notification record.");
      router.replace({ pathname: "/events/details", params: { eventId: event.id } });
    } catch {
      Alert.alert("Event not saved", "Only community admins can save events.");
    }
  };

  return (
    <>
      <AppHeader title={eventId ? "Edit Event" : "Create Event"} showNotifications={false} />
      <ScreenContainer>
        <View className="gap-4 rounded-lg border border-border bg-white p-4">
          {(["title", "eventType", "location", "startDateTime", "endDateTime", "organizerName", "bannerUrl", "description"] as const).map((name) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field, fieldState }) => (
                <TextField
                  label={{
                    title: "Title",
                    eventType: "Event type",
                    location: "Location",
                    startDateTime: "Start date/time",
                    endDateTime: "End date/time",
                    organizerName: "Organizer",
                    bannerUrl: "Banner URL",
                    description: "Description"
                  }[name]}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={name === "startDateTime" || name === "endDateTime" ? "2026-07-01T18:00:00+05:30" : undefined}
                  multiline={name === "description"}
                  error={fieldState.error?.message}
                />
              )}
            />
          ))}
          <PrimaryButton label={eventId ? "Save event" : "Create event"} loading={isSubmitting} onPress={handleSubmit(submit)} />
        </View>
      </ScreenContainer>
    </>
  );
}
