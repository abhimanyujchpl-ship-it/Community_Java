import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface AppSelectProps<T extends string> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
}

export function AppSelect<T extends string>({ label, value, options, onChange }: AppSelectProps<T>) {
  const selected = options.find((option) => option.value === value) ?? options[0];

  const selectNext = () => {
    const currentIndex = Math.max(0, options.findIndex((option) => option.value === value));
    const next = options[(currentIndex + 1) % options.length];
    onChange(next.value);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={({ pressed }) => [styles.select, pressed && styles.pressed]} onPress={selectNext}>
        <Text style={styles.value} numberOfLines={1}>
          {selected.label}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={30} color={colors.outline} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginLeft: spacing.xs,
    fontFamily: typography.family
  },
  select: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.lg
  },
  pressed: {
    opacity: 0.82,
    borderColor: colors.primary
  },
  value: {
    ...typography.bodyLg,
    flex: 1,
    color: colors.onSurface,
    fontFamily: typography.family
  }
});

