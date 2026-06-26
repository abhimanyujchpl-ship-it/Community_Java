import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function TextField({ label, error, className = "", ...props }: TextFieldProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        className={className}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={colors.textGrey}
        {...props}
      />
      {error ? <Text style={styles.error} numberOfLines={2}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 6
  },
  label: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontFamily: typography.familyMedium
  },
  input: {
    minHeight: 50,
    borderRadius: radius.default,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.onSurface,
    fontSize: 16,
    fontFamily: typography.family
  },
  inputError: {
    borderColor: colors.error
  },
  error: {
    ...typography.bodyMd,
    color: colors.error,
    fontFamily: typography.family
  }
});
