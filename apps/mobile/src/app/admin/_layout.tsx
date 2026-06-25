import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors } from "@/constants/colors";

const tabBarIcon =
  (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: string; size: number }) =>
    <Ionicons name={name} size={size} color={color} />;

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textGrey,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600"
        }
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard", tabBarIcon: tabBarIcon("speedometer-outline") }} />
      <Tabs.Screen name="access-requests" options={{ title: "Requests", tabBarIcon: tabBarIcon("person-add-outline") }} />
      <Tabs.Screen name="post-approvals" options={{ title: "Posts", tabBarIcon: tabBarIcon("document-text-outline") }} />
      <Tabs.Screen name="members" options={{ title: "Members", tabBarIcon: tabBarIcon("people-outline") }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: tabBarIcon("settings-outline") }} />
      <Tabs.Screen name="access-request-review" options={{ href: null }} />
      <Tabs.Screen name="post-review" options={{ href: null }} />
    </Tabs>
  );
}
