import { Image, Pressable, Text, View } from "react-native";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CommunityEvent } from "@/types";
import { eventStatusTone } from "@/utils/eventStatus";
import { formatDate } from "@/utils/formatDate";

interface EventCardProps {
  event: CommunityEvent;
  onPress?: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  return (
    <Pressable className="overflow-hidden rounded-xl border border-border bg-white" onPress={onPress}>
      {event.bannerUrl ? <Image source={{ uri: event.bannerUrl }} className="h-40 bg-lightBackground" /> : null}
      <View className="p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase text-primary">{event.eventType}</Text>
            <Text className="mt-1 text-lg font-bold text-textDark">{event.title}</Text>
          </View>
          <StatusBadge label={event.status} tone={eventStatusTone(event.status)} />
        </View>
        <Text className="mt-3 text-sm font-semibold text-textDark">{formatDate(event.startDateTime)}</Text>
        <Text className="mt-1 text-sm text-textGrey">{event.location}</Text>
        {event.description ? (
          <Text className="mt-3 text-sm leading-5 text-textGrey" numberOfLines={2}>
            {event.description}
          </Text>
        ) : null}
        <Text className="mt-3 text-xs font-medium text-primary">{event.reminders.length} reminders</Text>
      </View>
    </Pressable>
  );
}
