import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CommunityCard } from "@/components/cards/CommunityCard";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/headers/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { communityService } from "@/services/community.service";
import { CommunitySummary } from "@/types";

export default function CommunityDetailsScreen() {
  const { communityId } = useLocalSearchParams<{ communityId?: string }>();
  const [community, setCommunity] = useState<CommunitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!communityId) {
      setError("Community was not selected.");
      setLoading(false);
      return;
    }

    communityService
      .getById(communityId)
      .then(setCommunity)
      .catch(() => setError("Unable to load community details."))
      .finally(() => setLoading(false));
  }, [communityId]);

  return (
    <>
      <AppHeader title="Community Details" showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading community" /> : null}
        {!loading && error ? <EmptyState title="Details unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && community ? (
          <View className="gap-4">
            <CommunityCard community={community} />
            <View className="rounded-xl border border-border bg-white p-4">
              <Text className="text-base font-semibold text-textDark">About</Text>
              <Text className="mt-2 text-sm leading-5 text-textGrey">
                {community.description ?? "No description has been added for this community yet."}
              </Text>
            </View>
            <PrimaryButton
              label="Request to join"
              onPress={() => router.push({ pathname: "/community/access-request", params: { communityId: community.id } })}
            />
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}
