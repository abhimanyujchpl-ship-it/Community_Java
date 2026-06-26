import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, Text } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

interface PrimaryButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  fullWidth?: boolean;
}

export function PrimaryButton({ label, loading = false, disabled, icon, fullWidth = false, className = "", ...props }: PrimaryButtonProps) {
  return (
    <Pressable
      className={className}
      style={[styles.button, fullWidth ? styles.fullWidth : null, disabled ? styles.disabled : null]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          {icon ? <MaterialIcons name={icon} size={22} color={colors.onPrimary} style={{ marginRight: 8 }} /> : null}
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.default,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14
  },
  fullWidth: {
    width: "100%"
  },
  disabled: {
    opacity: 0.6
  },
  label: {
    ...typography.bodyLgStrong,
    textAlign: "center",
    color: colors.onPrimary,
    fontFamily: typography.familyBold
  }
});
