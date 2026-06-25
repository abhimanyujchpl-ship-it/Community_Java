import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { CommunityCard } from "@/components/cards/CommunityCard";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/headers/AppHeader";
import { SearchInput } from "@/components/forms/SearchInput";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { communityService } from "@/services/community.service";
import { CommunitySummary } from "@/types";

export default function CommunitySearchScreen() {
  const [query, setQuery] = useState("");
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);
      communityService
        .search(query)
        .then(setCommunities)
        .catch(() => setError("Unable to load communities."))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <AppHeader title="Find Community" showNotifications={false} />
      <ScreenContainer>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search by name, city, or state" />
        <View className="mt-4 gap-3">
          {loading ? <LoadingState message="Searching communities" /> : null}
          {!loading && error ? <EmptyState title="Search failed" message={error} icon="alert-circle-outline" /> : null}
          {!loading && !error && communities.length === 0 ? (
            <EmptyState title="No communities found" message="Try another name, city, or state." icon="people-outline" />
          ) : null}
          {!loading &&
            !error &&
            communities.map((community) => (
              <Pressable
                key={community.id}
                onPress={() => router.push({ pathname: "/community/details", params: { communityId: community.id } })}
              >
                <CommunityCard community={community} />
              </Pressable>
            ))}
        </View>
        <Pressable className="mt-5" onPress={() => router.push("/community/request-status")}>
          <Text className="text-center text-base font-semibold text-primary">View my request status</Text>
        </Pressable>
      </ScreenContainer>
    </>
  );
}
