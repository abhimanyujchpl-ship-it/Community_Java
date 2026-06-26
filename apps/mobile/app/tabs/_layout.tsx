import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors } from "@/constants/colors";

const tabBarIcon =
  (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: string; size: number }) =>
    <Ionicons name={name} size={size} color={color} />;

export default function BottomTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textGrey,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 66,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: 1
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600"
        }
      }}
    >
      <Tabs.Screen name="feed" options={{ title: "Feed", tabBarIcon: tabBarIcon("chatbubble-ellipses-outline") }} />
      <Tabs.Screen name="events" options={{ title: "Events", tabBarIcon: tabBarIcon("calendar-outline") }} />
      <Tabs.Screen name="community" options={{ title: "Community", tabBarIcon: tabBarIcon("people-outline") }} />
      <Tabs.Screen name="notifications" options={{ title: "Alerts", tabBarIcon: tabBarIcon("notifications-outline") }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: tabBarIcon("person-circle-outline") }} />
    </Tabs>
  );
}
