import { Ionicons } from "@expo/vector-icons";
import { TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/constants/colors";

export function SearchInput({ className = "", placeholder = "Search", ...props }: TextInputProps) {
  return (
    <View className={`min-h-12 flex-row items-center rounded-full border border-border bg-white px-4 ${className}`}>
      <Ionicons name="search" size={20} color={colors.textGrey} />
      <TextInput
        className="ml-2 flex-1 text-base text-textDark"
        placeholder={placeholder}
        placeholderTextColor={colors.textGrey}
        {...props}
      />
    </View>
  );
}
