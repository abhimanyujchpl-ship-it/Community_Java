import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, PressableProps, Text } from "react-native";
import { colors } from "@/constants/colors";

interface PrimaryButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  fullWidth?: boolean;
}

export function PrimaryButton({ label, loading = false, disabled, icon, fullWidth = false, className = "", ...props }: PrimaryButtonProps) {
  return (
    <Pressable
      className={`${fullWidth ? "w-full" : ""} min-h-14 flex-row items-center justify-center rounded-md bg-primary px-4 py-4 active:opacity-90 ${disabled ? "opacity-60" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          {icon ? <MaterialIcons name={icon} size={22} color={colors.onPrimary} style={{ marginRight: 8 }} /> : null}
          <Text className="text-center text-base font-bold text-white" numberOfLines={2}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
