import { EmptyState } from "@/components/lists/EmptyState";
import { AppHeader } from "@/components/headers/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
}

export function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps) {
  return (
    <>
      <AppHeader title={title} showSearch={false} showNotifications={false} />
      <ScreenContainer>
        <EmptyState title={title} message={subtitle ?? "This area is ready for product logic."} />
      </ScreenContainer>
    </>
  );
}
