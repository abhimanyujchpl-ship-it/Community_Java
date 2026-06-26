import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({ title, message, icon = "chatbubbles-outline" }: EmptyStateProps) {
  return (
    <View className="items-center justify-center rounded-lg border border-border bg-white p-6">
      <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-white">
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <Text className="text-center text-base font-semibold text-textDark" numberOfLines={2}>
        {title}
      </Text>
      {message ? (
        <Text className="mt-1 text-center text-sm leading-5 text-textGrey" numberOfLines={3}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}
