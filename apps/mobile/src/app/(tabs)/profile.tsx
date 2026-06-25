import { Text, View } from "react-native";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { AppHeader } from "@/components/headers/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";

export default function ProfileTabScreen() {
  return (
    <>
      <AppHeader title="Profile" showSearch={false} showNotifications={false} />
      <ScreenContainer>
        <View className="items-center rounded-xl border border-border bg-white p-5">
          <UserAvatar name="Demo User" size="lg" />
          <Text className="mt-3 text-xl font-bold text-textDark">Demo User</Text>
          <Text className="mt-1 text-sm text-textGrey">+1 000 000 0000</Text>
          <View className="mt-3">
            <StatusBadge label="Community Admin" tone="success" />
          </View>
        </View>
        <View className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
          <WhatsAppStyleListItem title="My community" subtitle="Greenwood Heights" rightText="Active" />
          <WhatsAppStyleListItem title="Saved posts" subtitle="Announcements and event notes" rightText="12" />
          <WhatsAppStyleListItem title="Security" subtitle="Password and device settings" rightText="Edit" />
        </View>
        <SecondaryButton label="Sign out" className="mt-5" />
      </ScreenContainer>
    </>
  );
}
