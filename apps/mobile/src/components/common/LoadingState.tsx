import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading" }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 py-12">
      <ActivityIndicator color={colors.primary} size="large" />
      <Text className="text-sm font-medium text-textGrey">{message}</Text>
    </View>
  );
}
