import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";

export function SearchInput({ className = "", placeholder = "Search", ...props }: TextInputProps) {
  return (
    <View className={className} style={styles.root}>
      <Ionicons name="search" size={20} color={colors.textGrey} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textGrey}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.md
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.onSurface,
    fontSize: 16
  }
});
