import { Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/constants/colors";

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function TextField({ label, error, className = "", ...props }: TextFieldProps) {
  return (
    <View className="gap-1">
      <Text className="text-sm font-medium text-textDark">{label}</Text>
      <TextInput
        className={`rounded-lg border border-border bg-white px-3 py-3 text-base text-textDark ${className}`}
        placeholderTextColor={colors.textGrey}
        {...props}
      />
      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}
