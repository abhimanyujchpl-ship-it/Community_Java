import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";

interface WhatsAppStyleListItemProps {
  title: string;
  subtitle: string;
  avatarName?: string;
  rightText?: string;
  badgeLabel?: string;
  badgeTone?: "success" | "warning" | "danger" | "neutral";
  leftSlot?: ReactNode;
  className?: string;
  onPress?: () => void;
}

export function WhatsAppStyleListItem({
  title,
  subtitle,
  avatarName,
  rightText,
  badgeLabel,
  badgeTone,
  leftSlot,
  className = "bg-white",
  onPress
}: WhatsAppStyleListItemProps) {
  return (
    <Pressable className={`min-h-16 flex-row items-center px-4 py-3 active:bg-lightBackground ${className}`} onPress={onPress}>
      {leftSlot ?? <UserAvatar name={avatarName ?? title} />}
      <View className="ml-3 flex-1 border-b border-border pb-3">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-base font-semibold text-textDark" numberOfLines={1}>
            {title}
          </Text>
          {rightText ? (
            <Text className="max-w-[96px] text-right text-xs text-textGrey" numberOfLines={1}>
              {rightText}
            </Text>
          ) : null}
        </View>
        <View className="mt-1 flex-row items-center justify-between gap-3">
          <Text className="flex-1 text-sm text-textGrey" numberOfLines={1}>
            {subtitle}
          </Text>
          {badgeLabel ? <StatusBadge label={badgeLabel} tone={badgeTone} /> : null}
        </View>
      </View>
    </Pressable>
  );
}
