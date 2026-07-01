import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { DashboardLayout, WebButton, WebCard, WebInput, WebTextarea } from "@/components/web/WebKit";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { eventService } from "@/services/event.service";

const eventSchema = z
  .object({
    title: z.string().min(2, "Title is required").max(180, "Title is too long"),
    eventType: z.string().min(2, "Event type is required").max(120, "Event type is too long"),
    description: z.string().max(3000, "Description is too long").optional(),
    location: z.string().min(2, "Location is required").max(240, "Location is too long"),
    startDateTime: z.string().min(1, "Start date/time is required"),
    endDateTime: z.string().min(1, "End date/time is required"),
    organizerName: z.string().max(160, "Organizer name is too long").optional(),
    reminderDateTime: z.string().optional()
  })
  .refine((values) => !Number.isNaN(new Date(values.startDateTime).getTime()), { path: ["startDateTime"], message: "Use a valid date/time" })
  .refine((values) => !Number.isNaN(new Date(values.endDateTime).getTime()), { path: ["endDateTime"], message: "Use a valid date/time" })
  .refine((values) => new Date(values.endDateTime).getTime() >= new Date(values.startDateTime).getTime(), { path: ["endDateTime"], message: "End date cannot be before start date" })
  .refine((values) => !values.reminderDateTime || !Number.isNaN(new Date(values.reminderDateTime).getTime()), { path: ["reminderDateTime"], message: "Use a valid reminder date/time" });

type EventForm = z.infer<typeof eventSchema>;

function apiError(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError.response) {
    return "Backend not reachable. Please start server on port 8080.";
  }
  return axiosError.response.data?.message ?? fallback;
}

function toInputDate(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function CreateEventScreen() {
  const { communityId, eventId } = useLocalSearchParams<{ communityId?: string; eventId?: string }>();
  const [loading, setLoading] = useState(Boolean(eventId));
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
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
      location: "",
      startDateTime: "",
      endDateTime: "",
      organizerName: "",
      reminderDateTime: ""
    }
  });

  useEffect(() => {
    if (!eventId) {
      return;
    }

    eventService
      .details(eventId)
      .then((event) => {
        reset({
          title: event.title,
          eventType: event.eventType,
          description: event.description ?? "",
          location: event.location,
          startDateTime: toInputDate(event.startDateTime),
          endDateTime: toInputDate(event.endDateTime),
          organizerName: event.organizerName ?? "",
          reminderDateTime: event.reminders[0] ? toInputDate(event.reminders[0].reminderDateTime) : ""
        });
      })
      .catch((error) => setStatus({ tone: "error", message: apiError(error, "Unable to load event.") }))
      .finally(() => setLoading(false));
  }, [eventId, reset]);

  const submit = async (values: EventForm) => {
    if (!communityId && !eventId) {
      setStatus({ tone: "error", message: "Select a community before creating an event." });
      return;
    }

    setStatus(null);
    try {
      const payload = {
        title: values.title.trim(),
        eventType: values.eventType.trim(),
        description: values.description?.trim() || undefined,
        location: values.location.trim(),
        startDateTime: new Date(values.startDateTime).toISOString(),
        endDateTime: new Date(values.endDateTime).toISOString(),
        organizerName: values.organizerName?.trim() || undefined
      };
      const event = eventId ? await eventService.update(eventId, payload) : await eventService.create({ communityId: communityId!, ...payload });
      if (values.reminderDateTime) {
        await eventService.addReminder(event.id, {
          reminderType: "ONE_TIME",
          reminderDateTime: new Date(values.reminderDateTime).toISOString(),
          message: `Reminder for ${event.title}`
        });
      }
      setStatus({ tone: "success", message: eventId ? "Event updated." : "Event created and members notified." });
      router.replace("/admin/events");
    } catch (error) {
      setStatus({ tone: "error", message: apiError(error, "Only community admins can save events.") });
    }
  };

  return (
    <DashboardLayout title={eventId ? "Edit Event" : "Create Event"} nav={["Dashboard", "Access Requests", "Post Approvals", "Members", "Events", "Settings"]}>
      <ScrollView contentContainerStyle={styles.page}>
        {loading ? <LoadingState message="Loading event" /> : null}
        {!loading ? (
          <WebCard style={styles.formCard}>
            <Text style={styles.heading}>{eventId ? "Edit event" : "Create event"}</Text>
            <Text style={styles.muted}>Members receive notifications for new events and reminders.</Text>
            <View style={styles.grid}>
              {(["title", "eventType", "location", "startDateTime", "endDateTime", "organizerName", "reminderDateTime"] as const).map((name) => (
                <View key={name} style={styles.field}>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field, fieldState }) => (
                      <WebInput
                        label={{
                          title: "Event title",
                          eventType: "Event type",
                          location: "Location",
                          startDateTime: "Start date/time",
                          endDateTime: "End date/time",
                          organizerName: "Organizer name",
                          reminderDateTime: "Reminder date/time"
                        }[name]}
                        placeholder={name.includes("DateTime") ? "2026-07-01T18:00" : undefined}
                        value={field.value}
                        onChangeText={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </View>
              ))}
            </View>
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <WebTextarea label="Description" placeholder="Add agenda, details, or instructions" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
              )}
            />
            {status ? <Text style={[styles.toast, status.tone === "success" ? styles.toastSuccess : styles.toastError]}>{status.message}</Text> : null}
            <WebButton label={isSubmitting ? "Saving..." : eventId ? "Save Event" : "Create Event"} onPress={handleSubmit(submit)} />
          </WebCard>
        ) : null}
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  formCard: { gap: spacing.lg, maxWidth: 860, width: "100%" },
  heading: { ...typography.headlineMd, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  field: { flexBasis: "48%", flexGrow: 1, minWidth: 250 },
  toast: { borderRadius: radius.default, padding: spacing.md, textAlign: "center", fontWeight: "700" },
  toastSuccess: { color: colors.success, backgroundColor: "#dcfce7" },
  toastError: { color: colors.error, backgroundColor: colors.errorContainer }
});

