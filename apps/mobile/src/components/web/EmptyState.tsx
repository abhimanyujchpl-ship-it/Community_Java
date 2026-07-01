import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export function EmptyState({ title, message, icon = "inbox" }: { title: string; message?: string; icon?: keyof typeof MaterialIcons.glyphMap }) {
  return (
    <View style={styles.root}>
      <MaterialIcons name={icon} size={30} color={colors.primary} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.xl
  },
  title: {
    ...typography.bodyLgStrong,
    color: colors.onSurface,
    fontFamily: typography.familyBold,
    textAlign: "center"
  },
  message: {
    color: colors.textGrey,
    textAlign: "center"
  }
});

