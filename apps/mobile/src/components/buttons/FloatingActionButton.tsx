import { Ionicons } from "@expo/vector-icons";
import { Pressable, PressableProps } from "react-native";
import { colors } from "@/constants/colors";

interface FloatingActionButtonProps extends PressableProps {
  icon?: keyof typeof Ionicons.glyphMap;
}

export function FloatingActionButton({ icon = "add", className = "", ...props }: FloatingActionButtonProps) {
  return (
    <Pressable
      className={`absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full bg-accent shadow ${className}`}
      accessibilityRole="button"
      {...props}
    >
      <Ionicons name={icon} size={28} color={colors.white} />
    </Pressable>
  );
}
