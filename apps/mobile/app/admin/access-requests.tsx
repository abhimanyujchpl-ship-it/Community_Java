import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { CommunityCard } from "@/components/cards/CommunityCard";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/common/AppHeader";
import { SearchInput } from "@/components/forms/SearchInput";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";
import { accessRequestService } from "@/services/access-request.service";
import { communityService } from "@/services/community.service";
import { AccessRequest, CommunitySummary } from "@/types";
import { accessRequestTone } from "@/utils/accessRequestStatus";

export default function AdminAccessRequestsScreen() {
  const [query, setQuery] = useState("");
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunitySummary | null>(null);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingCommunities(true);
      communityService
        .search(query)
        .then(setCommunities)
        .catch(() => setError("Unable to load communities."))
        .finally(() => setLoadingCommunities(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const selectCommunity = async (community: CommunitySummary) => {
    setSelectedCommunity(community);
    setLoadingRequests(true);
    setError(null);
    try {
      const data = await accessRequestService.byCommunity(community.id);
      setRequests(data);
    } catch {
      setError("Unable to load access requests for this community.");
    } finally {
      setLoadingRequests(false);
    }
  };

  return (
    <>
      <AppHeader title="Requests" showNotifications={false} />
      <ScreenContainer padded={false}>
        <View className="bg-white px-4 py-3">
          <SearchInput value={query} onChangeText={setQuery} placeholder="Search community to review" />
        </View>

        {!selectedCommunity ? (
          <View className="gap-3 p-4">
            {loadingCommunities ? <LoadingState message="Loading communities" /> : null}
            {!loadingCommunities && communities.length === 0 ? (
              <EmptyState title="No communities found" message="Search by community name, city, or state." />
            ) : null}
            {!loadingCommunities &&
              communities.map((community) => (
                <Pressable key={community.id} onPress={() => selectCommunity(community)}>
                  <CommunityCard community={community} />
                </Pressable>
              ))}
          </View>
        ) : (
          <View>
            <View className="border-b border-border bg-lightBackground p-4">
              <Text className="text-xs font-semibold uppercase text-textGrey">Reviewing</Text>
              <Text className="mt-1 text-lg font-bold text-textDark">{selectedCommunity.name}</Text>
              <Pressable className="mt-2" onPress={() => setSelectedCommunity(null)}>
                <Text className="text-sm font-semibold text-primary">Change community</Text>
              </Pressable>
            </View>
            {loadingRequests ? <LoadingState message="Loading requests" /> : null}
            {!loadingRequests && error ? (
              <View className="p-4">
                <EmptyState title="Requests unavailable" message={error} icon="alert-circle-outline" />
              </View>
            ) : null}
            {!loadingRequests && !error && requests.filter((request) => request.status === "PENDING").length === 0 ? (
              <View className="p-4">
                <EmptyState title="No pending requests" message="New join requests will appear here." />
              </View>
            ) : null}
            {!loadingRequests &&
              !error &&
              requests
                .filter((request) => request.status === "PENDING")
                .map((request) => (
                  <WhatsAppStyleListItem
                    key={request.id}
                    title={request.user.fullName}
                    subtitle={`${request.user.mobile} · ${request.requestMessage ?? "Requested access"}`}
                    rightText={new Date(request.createdAt).toLocaleDateString()}
                    badgeLabel={request.status}
                    badgeTone={accessRequestTone(request.status)}
                    onPress={() =>
                      router.push({
                        pathname: "/admin/access-request-review",
                        params: { requestId: request.id, communityId: selectedCommunity.id }
                      })
                    }
                  />
                ))}
          </View>
        )}
      </ScreenContainer>
    </>
  );
}
