import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { eventService } from "@/services/event.service";
import { ReminderType } from "@/types";

const reminderTypes: ReminderType[] = ["ONE_TIME", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

export default function ReminderSettingsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [reminderType, setReminderType] = useState<ReminderType>("ONE_TIME");
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!eventId) {
      Alert.alert("Event required", "Open an event before setting a reminder.");
      return;
    }
    if (!reminderDateTime.trim() || !message.trim()) {
      Alert.alert("Missing details", "Reminder date/time and message are required.");
      return;
    }

    setSubmitting(true);
    try {
      await eventService.addReminder(eventId, {
        reminderType,
        reminderDateTime: new Date(reminderDateTime).toISOString(),
        message: message.trim()
      });
      Alert.alert("Reminder saved", "Reminder is stored for future push notification integration.");
      router.back();
    } catch {
      Alert.alert("Reminder not saved", "Check the reminder date/time and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader title="Reminder" showNotifications={false} />
      <ScreenContainer>
        <View className="gap-4 rounded-lg border border-border bg-white p-4">
          <Text className="text-base font-semibold text-textDark">Reminder type</Text>
          <View className="flex-row flex-wrap gap-2">
            {reminderTypes.map((type) => (
              <Text
                key={type}
                className={`rounded-full px-3 py-2 text-sm font-semibold ${reminderType === type ? "bg-primary text-white" : "bg-lightBackground text-textGrey"}`}
                onPress={() => setReminderType(type)}
              >
                {type.replace(/_/g, " ")}
              </Text>
            ))}
          </View>
          <TextField label="Reminder date/time" value={reminderDateTime} onChangeText={setReminderDateTime} placeholder="2026-07-01 17:30" />
          <TextField label="Message" value={message} onChangeText={setMessage} placeholder="Reminder message" multiline />
          <PrimaryButton label="Save reminder" loading={submitting} onPress={submit} />
        </View>
      </ScreenContainer>
    </>
  );
}
