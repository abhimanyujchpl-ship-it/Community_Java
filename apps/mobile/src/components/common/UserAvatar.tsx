import { Text, View } from "react-native";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-16 w-16"
};

const textClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl"
};

export function UserAvatar({ name, size = "md" }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View className={`${sizeClasses[size]} shrink-0 items-center justify-center rounded-full bg-primary`}>
      <Text className={`${textClasses[size]} font-bold text-white`} numberOfLines={1}>
        {initials || "U"}
      </Text>
    </View>
  );
}
