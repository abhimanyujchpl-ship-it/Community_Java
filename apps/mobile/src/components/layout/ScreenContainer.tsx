import { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

export interface ScreenContainerProps extends PropsWithChildren {
  scroll?: boolean;
  padded?: boolean;
  className?: string;
}

export function ScreenContainer({ children, scroll = true, padded = true, className = "" }: ScreenContainerProps) {
  const content = <View className={`flex-1 ${padded ? "px-4 py-4" : ""} ${className}`}>{children}</View>;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {scroll ? <ScrollView keyboardShouldPersistTaps="handled">{content}</ScrollView> : content}
    </SafeAreaView>
  );
}
