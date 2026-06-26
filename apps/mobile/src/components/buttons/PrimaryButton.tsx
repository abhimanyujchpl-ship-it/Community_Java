import { ActivityIndicator, Pressable, PressableProps, Text } from "react-native";
import { colors } from "@/constants/colors";

interface PrimaryButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
}

export function PrimaryButton({ label, loading = false, disabled, className = "", ...props }: PrimaryButtonProps) {
  return (
    <Pressable
      className={`min-h-12 flex-row items-center justify-center rounded-lg bg-primary px-4 py-3 active:opacity-90 ${disabled ? "opacity-60" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text className="text-center text-base font-semibold text-white" numberOfLines={2}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
