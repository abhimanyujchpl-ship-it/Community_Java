import { AppHeader } from "@/components/headers/AppHeader";
import { SearchInput } from "@/components/forms/SearchInput";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";
import { View } from "react-native";

const members = [
  { title: "Demo User", subtitle: "Community Admin", right: "Admin", badge: "Active" },
  { title: "Anika Rao", subtitle: "Tower A 1204", right: "Member", badge: "Active" },
  { title: "Mohan Sharma", subtitle: "Tower B 703", right: "Member", badge: "Active" }
];

export default function MembersScreen() {
  return (
    <>
      <AppHeader title="Members" showNotifications={false} />
      <ScreenContainer padded={false}>
        <View className="bg-white px-4 py-3">
          <SearchInput placeholder="Search members" />
        </View>
        {members.map((member) => (
          <WhatsAppStyleListItem
            key={member.title}
            title={member.title}
            subtitle={member.subtitle}
            rightText={member.right}
            badgeLabel={member.badge}
            badgeTone="success"
          />
        ))}
      </ScreenContainer>
    </>
  );
}
