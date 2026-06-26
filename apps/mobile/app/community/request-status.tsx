import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";
import { accessRequestService } from "@/services/access-request.service";
import { useCommunityStore } from "@/store/community.store";
import { AccessRequest } from "@/types";
import { accessRequestTone } from "@/utils/accessRequestStatus";

export default function MyRequestStatusScreen() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setActiveCommunity = useCommunityStore((state) => state.setActiveCommunity);

  useEffect(() => {
    accessRequestService
      .mine()
      .then(setRequests)
      .catch(() => setError("Unable to load your requests."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AppHeader title="Request Status" showNotifications={false} />
      <ScreenContainer padded={false}>
        {loading ? <LoadingState message="Loading requests" /> : null}
        {!loading && error ? (
          <View className="p-4">
            <EmptyState title="Status unavailable" message={error} icon="alert-circle-outline" />
          </View>
        ) : null}
        {!loading && !error && requests.length === 0 ? (
          <View className="p-4">
            <EmptyState title="No requests yet" message="Search for a community and send a join request." />
          </View>
        ) : null}
        {!loading &&
          !error &&
          requests.map((request) => (
            <WhatsAppStyleListItem
              key={request.id}
              title={request.community.name}
              subtitle={request.rejectionReason ?? request.requestMessage ?? `${request.community.city}, ${request.community.state}`}
              rightText={new Date(request.createdAt).toLocaleDateString()}
              badgeLabel={request.status}
              badgeTone={accessRequestTone(request.status)}
              onPress={() => {
                if (request.status === "APPROVED") {
                  setActiveCommunity(request.community);
                  router.push({ pathname: "/community/dashboard", params: { communityId: request.community.id } });
                }
              }}
            />
          ))}
      </ScreenContainer>
    </>
  );
}
