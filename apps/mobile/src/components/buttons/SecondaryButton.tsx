import { Pressable, PressableProps, Text } from "react-native";

interface SecondaryButtonProps extends PressableProps {
  label: string;
}

export function SecondaryButton({ label, disabled, className = "", ...props }: SecondaryButtonProps) {
  return (
    <Pressable
      className={`min-h-12 items-center justify-center rounded-lg border border-border bg-white px-4 py-3 active:bg-lightBackground ${disabled ? "opacity-60" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      <Text className="text-center text-base font-semibold text-primary" numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}
