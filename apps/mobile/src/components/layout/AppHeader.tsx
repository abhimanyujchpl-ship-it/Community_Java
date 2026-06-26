import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

interface AppHeaderProps {
  title: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  showSearch?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
  notificationCount?: number;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
}

export function AppHeader({
  title,
  leftIcon,
  rightIcon,
  showSearch = true,
  showNotifications = true,
  showMenu = true,
  notificationCount = 0,
  onLeftPress,
  onRightPress,
  onSearchPress,
  onNotificationsPress,
  onMenuPress
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {leftIcon ? (
          <Pressable style={styles.iconButton} onPress={onLeftPress} accessibilityRole="button">
            <MaterialIcons name={leftIcon} size={28} color={colors.onPrimary} />
          </Pressable>
        ) : null}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.actions}>
        {rightIcon ? (
          <Pressable style={styles.iconButton} onPress={onRightPress} accessibilityRole="button">
            <MaterialIcons name={rightIcon} size={27} color={colors.onPrimary} />
          </Pressable>
        ) : null}
        {!rightIcon && showSearch ? (
          <Pressable style={styles.iconButton} onPress={onSearchPress} accessibilityRole="button">
            <MaterialIcons name="search" size={24} color={colors.onPrimary} />
          </Pressable>
        ) : null}
        {!rightIcon && showNotifications ? (
          <Pressable style={styles.iconButton} onPress={onNotificationsPress} accessibilityRole="button">
            <MaterialIcons name="notifications-none" size={24} color={colors.onPrimary} />
            {notificationCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount > 99 ? "99+" : notificationCount}</Text>
              </View>
            ) : null}
          </Pressable>
        ) : null}
        {!rightIcon && showMenu ? (
          <Pressable style={styles.iconButton} onPress={onMenuPress} accessibilityRole="button">
            <MaterialIcons name="more-vert" size={24} color={colors.onPrimary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 64,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  left: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.gutter
  },
  title: {
    ...typography.headlineMdMobile,
    flex: 1,
    color: colors.onPrimary,
    fontFamily: typography.family
  },
  actions: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  badge: {
    position: "absolute",
    right: 3,
    top: 3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accentGreen,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4
  },
  badgeText: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: "700"
  }
});

