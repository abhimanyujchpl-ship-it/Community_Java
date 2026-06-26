import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";

export default function AdminSettingsScreen() {
  return (
    <>
      <AppHeader title="Settings" showSearch={false} showNotifications={false} />
      <ScreenContainer padded={false}>
        <WhatsAppStyleListItem title="Community settings" subtitle="Name, description, visibility" rightText="Edit" />
        <WhatsAppStyleListItem title="Approval rules" subtitle="Access requests and post moderation" rightText="Manage" />
        <WhatsAppStyleListItem title="Notification settings" subtitle="Admin alerts and member updates" rightText="On" />
      </ScreenContainer>
    </>
  );
}
