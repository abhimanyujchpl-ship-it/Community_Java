import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

interface InfoBoxProps {
  message: string;
}

export function InfoBox({ message }: InfoBoxProps) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="info-outline" size={24} color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 104,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.gutter,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(0, 45, 39, 0.2)",
    backgroundColor: "rgba(0, 69, 61, 0.10)"
  },
  text: {
    ...typography.bodyLg,
    flex: 1,
    color: colors.onSurfaceVariant,
    fontFamily: typography.family
  }
});

