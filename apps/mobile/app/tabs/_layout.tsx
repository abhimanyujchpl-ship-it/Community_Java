import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";

const tabBarIcon =
  (name: keyof typeof MaterialIcons.glyphMap) =>
  ({ color, focused }: { color: string; focused: boolean }) =>
    (
      <View style={[styles.iconWrap, focused ? styles.iconWrapActive : null]}>
        <MaterialIcons name={name} size={22} color={color} />
      </View>
    );

export default function BottomTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item
      }}
    >
      <Tabs.Screen name="feed" options={{ title: "Feed", tabBarIcon: tabBarIcon("forum") }} />
      <Tabs.Screen name="events" options={{ title: "Events", tabBarIcon: tabBarIcon("event") }} />
      <Tabs.Screen name="community" options={{ title: "Community", tabBarIcon: tabBarIcon("groups") }} />
      <Tabs.Screen name="notifications" options={{ title: "Alerts", tabBarIcon: tabBarIcon("notifications-none") }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: tabBarIcon("person-outline") }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    paddingTop: 6,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(191, 200, 197, 0.75)",
    backgroundColor: colors.surfaceContainerLowest
  },
  item: {
    minHeight: 58
  },
  label: {
    fontSize: 11,
    fontWeight: "700"
  },
  iconWrap: {
    minWidth: 44,
    height: 28,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center"
  },
  iconWrapActive: {
    backgroundColor: colors.secondaryContainer
  }
});
