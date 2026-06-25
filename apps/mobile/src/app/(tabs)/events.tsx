import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { CommunityCard } from "@/components/cards/CommunityCard";
import { LoadingState } from "@/components/common/LoadingState";
import { SearchInput } from "@/components/forms/SearchInput";
import { AppHeader } from "@/components/headers/AppHeader";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { communityService } from "@/services/community.service";
import { CommunitySummary } from "@/types";

export default function EventsTabScreen() {
  const [query, setQuery] = useState("");
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notificationCount = useUnreadNotificationCount();

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
      <AppHeader
        title="Events"
        showMenu={false}
        notificationCount={notificationCount}
        onNotificationsPress={() => router.push("/(tabs)/notifications")}
      />
      <ScreenContainer>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search community events" />
        <View className="mt-4 gap-3">
          {loading ? <LoadingState message="Loading communities" /> : null}
          {!loading && error ? <EmptyState title="Events unavailable" message={error} icon="alert-circle-outline" /> : null}
          {!loading && !error && communities.length === 0 ? <EmptyState title="No communities found" /> : null}
          {!loading &&
            !error &&
            communities.map((community) => (
              <View key={community.id} className="gap-2">
                <Pressable onPress={() => router.push({ pathname: "/events/list", params: { communityId: community.id } })}>
                  <CommunityCard community={community} />
                </Pressable>
                <View className="flex-row gap-2">
                  <Text
                    className="flex-1 rounded-lg bg-lightBackground px-3 py-2 text-center text-sm font-semibold text-primary"
                    onPress={() => router.push({ pathname: "/events/calendar", params: { communityId: community.id } })}
                  >
                    Calendar
                  </Text>
                  <Text
                    className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white"
                    onPress={() => router.push({ pathname: "/events/create", params: { communityId: community.id } })}
                  >
                    Create
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScreenContainer>
    </>
  );
}
