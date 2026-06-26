import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { Platform, Pressable, Text, View } from "react-native";
import { LoadingState } from "@/components/common/LoadingState";
import { Screen } from "@/components/layout/Screen";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth.store";

function WebAction({
  label,
  icon,
  onPress,
  primary = false
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-lg px-4 py-3 ${
        primary ? "bg-primary" : "border border-border bg-white"
      }`}
      onPress={onPress}
    >
      <Ionicons name={icon} size={18} color={primary ? colors.white : colors.primary} />
      <Text className={`text-center text-sm font-bold ${primary ? "text-white" : "text-primary"}`} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function WebPreviewCard({
  title,
  subtitle,
  icon,
  className = ""
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  className?: string;
}) {
  return (
    <View className={`rounded-lg border border-border bg-white p-4 ${className}`}>
      <View className="mb-3 h-10 w-10 items-center justify-center rounded-full bg-lightBackground">
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text className="text-base font-bold text-textDark" numberOfLines={1}>
        {title}
      </Text>
      <Text className="mt-1 text-sm leading-5 text-textGrey" numberOfLines={3}>
        {subtitle}
      </Text>
    </View>
  );
}

function WebHomeScreen({
  isAuthenticated,
  role
}: {
  isAuthenticated: boolean;
  role?: string;
}) {
  const continuePath = role === "MEMBER" ? "/tabs/community" : "/admin/dashboard";

  return (
    <Screen>
      <View className="mx-auto w-full max-w-6xl gap-6 py-4">
        <View className="rounded-lg bg-primary p-5">
          <Text className="text-sm font-bold uppercase text-white/80">Community App Web</Text>
          <Text className="mt-3 text-3xl font-bold text-white" numberOfLines={3}>
            A clean WhatsApp-like web view for community management.
          </Text>
          <Text className="mt-3 max-w-3xl text-base leading-6 text-white/85">
            Visualize member feeds, access requests, post approvals, events, calendars, notifications, and admin workflows from the browser.
          </Text>
          <View className="mt-5 flex-row flex-wrap gap-3">
            {isAuthenticated ? (
              <WebAction label="Continue app" icon="arrow-forward" primary onPress={() => router.push(continuePath)} />
            ) : (
              <>
                <WebAction label="Sign in" icon="log-in-outline" primary onPress={() => router.push("/auth/login")} />
                <WebAction label="Create account" icon="person-add-outline" onPress={() => router.push("/auth/register")} />
              </>
            )}
            <WebAction label="Browse communities" icon="people-outline" onPress={() => router.push("/community/search")} />
          </View>
        </View>

        <View className="flex-row flex-wrap gap-4">
          <WebPreviewCard className="min-w-[240px] flex-1" title="Member workspace" subtitle="Feed previews, announcements, my posts, reminders, and notification shortcuts." icon="chatbubbles-outline" />
          <WebPreviewCard className="min-w-[240px] flex-1" title="Admin dashboard" subtitle="Pending access requests, post approvals, member counts, events, and recent activity." icon="speedometer-outline" />
          <WebPreviewCard className="min-w-[240px] flex-1" title="Community operations" subtitle="Search communities, request access, manage posts, create events, and track unread updates." icon="calendar-outline" />
        </View>

        <View className="flex-row flex-wrap gap-4">
          <View className="min-w-[280px] flex-1 rounded-lg border border-border bg-white p-4">
            <Text className="text-lg font-bold text-textDark">Member flow</Text>
            {["Register or sign in", "Search community", "Send access request", "Open dashboard after approval", "Create posts and view events"].map((item) => (
              <View key={item} className="mt-3 flex-row items-center gap-3">
                <View className="h-7 w-7 items-center justify-center rounded-full bg-accent">
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                </View>
                <Text className="flex-1 text-sm font-medium text-textDark">{item}</Text>
              </View>
            ))}
          </View>

          <View className="min-w-[280px] flex-1 rounded-lg border border-border bg-white p-4">
            <Text className="text-lg font-bold text-textDark">Admin flow</Text>
            {["Review access requests", "Approve or reject posts", "Manage members", "Create events", "Monitor notifications"].map((item) => (
              <View key={item} className="mt-3 flex-row items-center gap-3">
                <View className="h-7 w-7 items-center justify-center rounded-full bg-primary">
                  <Ionicons name="shield-checkmark" size={15} color={colors.white} />
                </View>
                <Text className="flex-1 text-sm font-medium text-textDark">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
}

export default function HomeScreen() {
  const { bootstrapped, isAuthenticated, user } = useAuthStore();

  if (!bootstrapped) {
    return (
      <Screen>
        <LoadingState message="Opening app" />
      </Screen>
    );
  }

  if (Platform.OS === "web") {
    return <WebHomeScreen isAuthenticated={isAuthenticated} role={user?.role} />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href={user?.role === "MEMBER" ? "/tabs/community" : "/admin/access-requests"} />;
}
