import { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
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
      className={className}
      style={[styles.content, padded ? styles.padded : null]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    flex: 1
  },
  padded: {
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.md
  }
});
