import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";

export function LoadingState({ message = "Loading" }: { message?: string }) {
  return (
    <View style={styles.root}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.xl
  },
  text: {
    color: colors.textGrey
  }
});

