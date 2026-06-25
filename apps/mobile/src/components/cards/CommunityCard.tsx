import { Image, Text, View } from "react-native";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { CommunitySummary } from "@/types";

interface CommunityCardProps {
  community: CommunitySummary;
}

export function CommunityCard({ community }: CommunityCardProps) {
  const location = [community.city, community.state].filter(Boolean).join(", ");

  return (
    <View className="rounded-xl border border-border bg-white p-4">
      <View className="flex-row gap-3">
        {community.logoUrl ? (
          <Image source={{ uri: community.logoUrl }} className="h-14 w-14 rounded-full bg-lightBackground" />
        ) : (
          <UserAvatar name={community.name} size="lg" />
        )}
        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <Text className="flex-1 text-lg font-semibold text-textDark">{community.name}</Text>
            <StatusBadge label={community.status} tone={community.status === "ACTIVE" ? "success" : "neutral"} />
          </View>
          <Text className="mt-1 text-sm text-textGrey">{location}</Text>
          <Text className="mt-2 text-sm text-textGrey" numberOfLines={2}>
            {community.description ?? "Community"}
          </Text>
          <Text className="mt-3 text-xs font-medium text-primary">{community.memberCount} members</Text>
        </View>
      </View>
    </View>
  );
}
