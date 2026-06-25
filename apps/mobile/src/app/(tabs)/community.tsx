import { router } from "expo-router";
import { View } from "react-native";
import { AppHeader } from "@/components/headers/AppHeader";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";

export default function CommunityTabScreen() {
  const notificationCount = useUnreadNotificationCount();

  return (
    <>
      <AppHeader title="Community" notificationCount={notificationCount} onNotificationsPress={() => router.push("/(tabs)/notifications")} />
      <ScreenContainer padded={false}>
        <View className="flex-1 bg-white">
          <WhatsAppStyleListItem
            title="Find a community"
            subtitle="Search by name, city, or state and request access"
            rightText="Open"
            badgeLabel="Search"
            badgeTone="success"
            onPress={() => router.push("/community/search")}
          />
          <WhatsAppStyleListItem
            title="My request status"
            subtitle="Track pending, approved, and rejected requests"
            rightText="View"
            badgeLabel="Status"
            badgeTone="warning"
            onPress={() => router.push("/community/request-status")}
          />
        </View>
      </ScreenContainer>
    </>
  );
}
