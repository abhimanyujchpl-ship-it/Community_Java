import { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

interface AppTextInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function AppTextInput({ label, error, multiline, style, ...props }: AppTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline, focused && styles.focused, error && styles.error, style]}
        placeholderTextColor="rgba(112, 121, 118, 0.65)"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  input: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.default,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.lg,
    color: colors.onSurface,
    ...typography.bodyLg,
    fontFamily: typography.family
  },
  multiline: {
    minHeight: 242,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg
  },
  focused: {
    borderColor: colors.primary
  },
  error: {
    borderColor: colors.error
  },
  errorText: {
    ...typography.labelMd,
    color: colors.error,
    marginLeft: spacing.xs,
    fontFamily: typography.family
  }
});

