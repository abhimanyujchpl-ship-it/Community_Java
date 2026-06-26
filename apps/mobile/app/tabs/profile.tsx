import { router } from "expo-router";
import { Text, View } from "react-native";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";
import { useAuthStore } from "@/store/auth.store";

export default function ProfileTabScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const logout = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  return (
    <>
      <AppHeader title="Profile" showSearch={false} showNotifications={false} />
      <ScreenContainer>
        <View className="items-center rounded-xl border border-border bg-white p-5">
          <UserAvatar name={user?.fullName ?? "Member"} size="lg" />
          <Text className="mt-3 text-xl font-bold text-textDark">{user?.fullName ?? "Member"}</Text>
          <Text className="mt-1 text-sm text-textGrey">{user?.mobile ?? ""}</Text>
          <View className="mt-3">
            <StatusBadge label={user?.role?.replaceAll("_", " ") ?? "MEMBER"} tone="success" />
          </View>
        </View>
        <View className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
          <WhatsAppStyleListItem title="Edit profile" subtitle={user?.email ?? "Update your details"} rightText="Open" onPress={() => router.push("/user/profile")} />
          <WhatsAppStyleListItem title="My posts" subtitle="Track approvals and rejections" rightText="View" onPress={() => router.push("/posts/my-posts")} />
          <WhatsAppStyleListItem title="Notifications" subtitle="Unread alerts and approvals" rightText="Open" onPress={() => router.push("/tabs/notifications")} />
        </View>
        <SecondaryButton label="Sign out" className="mt-5" onPress={logout} />
      </ScreenContainer>
    </>
  );
}
