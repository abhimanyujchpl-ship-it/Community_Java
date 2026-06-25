import { Pressable, PressableProps, Text } from "react-native";

interface SecondaryButtonProps extends PressableProps {
  label: string;
}

export function SecondaryButton({ label, disabled, className = "", ...props }: SecondaryButtonProps) {
  return (
    <Pressable
      className={`min-h-12 items-center justify-center rounded-lg border border-border bg-white px-4 py-3 ${disabled ? "opacity-60" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      <Text className="text-base font-semibold text-primary">{label}</Text>
    </Pressable>
  );
}
