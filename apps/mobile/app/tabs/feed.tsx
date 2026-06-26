import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { CommunityCard } from "@/components/cards/CommunityCard";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/common/AppHeader";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { SearchInput } from "@/components/forms/SearchInput";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { communityService } from "@/services/community.service";
import { CommunitySummary } from "@/types";

export default function FeedTabScreen() {
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
      <AppHeader title="Feed" notificationCount={notificationCount} onNotificationsPress={() => router.push("/tabs/notifications")} />
      <ScreenContainer>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search community feed" />
        <Pressable className="mt-4 rounded-lg border border-border bg-white p-4 active:bg-lightBackground" onPress={() => router.push("/posts/my-posts")}>
          <Text className="text-base font-bold text-textDark">My Posts</Text>
          <Text className="mt-1 text-sm text-textGrey" numberOfLines={2}>View pending, approved, and rejected posts.</Text>
        </Pressable>
        <View className="mt-4 gap-3">
          {loading ? <LoadingState message="Loading communities" /> : null}
          {!loading && error ? <EmptyState title="Feeds unavailable" message={error} icon="alert-circle-outline" /> : null}
          {!loading && !error && communities.length === 0 ? <EmptyState title="No communities found" /> : null}
          {!loading &&
            !error &&
            communities.map((community) => (
              <Pressable
                key={community.id}
                onPress={() => router.push({ pathname: "/posts/feed", params: { communityId: community.id } })}
                onLongPress={() => router.push({ pathname: "/posts/create", params: { communityId: community.id } })}
              >
                <CommunityCard community={community} />
              </Pressable>
            ))}
        </View>
      </ScreenContainer>
    </>
  );
}
