import { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";

export interface ScreenContainerProps extends PropsWithChildren {
  scroll?: boolean;
  padded?: boolean;
  className?: string;
}

export function ScreenContainer({ children, scroll = true, padded = true, className = "" }: ScreenContainerProps) {
  const content = (
    <View
      className={`flex-1 ${className}`}
      style={padded ? { paddingHorizontal: spacing.containerPadding, paddingVertical: spacing.md } : undefined}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.surface }}>
      {scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
