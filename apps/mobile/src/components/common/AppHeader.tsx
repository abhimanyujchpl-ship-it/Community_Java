import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface AppHeaderProps {
  title: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
  notificationCount?: number;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
}

export function AppHeader({
  title,
  showSearch = true,
  showNotifications = true,
  showMenu = true,
  notificationCount = 0,
  onSearchPress,
  onNotificationsPress,
  onMenuPress
}: AppHeaderProps) {
  return (
    <View className="bg-primary px-4 pb-3 pt-4">
      <View className="min-h-11 flex-row items-center justify-between">
        <Text className="mr-3 flex-1 text-2xl font-bold text-white" numberOfLines={1}>
          {title}
        </Text>
        <View className="flex-row items-center">
          {showSearch ? (
            <Pressable className="h-11 w-11 items-center justify-center rounded-full active:bg-white/10" onPress={onSearchPress}>
              <Ionicons name="search" size={22} color={colors.white} />
            </Pressable>
          ) : null}
          {showNotifications ? (
            <Pressable className="h-11 w-11 items-center justify-center rounded-full active:bg-white/10" onPress={onNotificationsPress}>
              <Ionicons name="notifications-outline" size={22} color={colors.white} />
              {notificationCount > 0 ? (
                <View className="absolute right-1 top-1 min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1">
                  <Text className="text-xs font-bold text-white">{notificationCount > 99 ? "99+" : notificationCount}</Text>
                </View>
              ) : null}
            </Pressable>
          ) : null}
          {showMenu ? (
            <Pressable className="h-11 w-11 items-center justify-center rounded-full active:bg-white/10" onPress={onMenuPress}>
              <Ionicons name="ellipsis-vertical" size={21} color={colors.white} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
