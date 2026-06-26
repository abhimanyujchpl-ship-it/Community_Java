import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

interface UploadTileProps {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
}

export function UploadTile({ label, icon, onPress }: UploadTileProps) {
  return (
    <Pressable style={({ pressed }) => [styles.tile, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.iconCircle}>
        <MaterialIcons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    minHeight: 176,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.outlineVariant,
    borderRadius: radius.md
  },
  pressed: {
    opacity: 0.75,
    borderColor: colors.primary
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    backgroundColor: "rgba(0, 45, 39, 0.05)"
  },
  label: {
    ...typography.bodyLgStrong,
    color: colors.primary,
    fontFamily: typography.family
  }
});

