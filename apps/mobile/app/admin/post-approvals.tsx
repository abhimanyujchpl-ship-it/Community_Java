import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { CommunityCard } from "@/components/cards/CommunityCard";
import { PostCard } from "@/components/cards/PostCard";
import { LoadingState } from "@/components/common/LoadingState";
import { SearchInput } from "@/components/forms/SearchInput";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { communityService } from "@/services/community.service";
import { postService } from "@/services/post.service";
import { CommunityPost, CommunitySummary } from "@/types";

export default function PostApprovalsScreen() {
  const [query, setQuery] = useState("");
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunitySummary | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
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
    setLoadingPosts(true);
    setError(null);
    try {
      setPosts(await postService.pending(community.id));
    } catch {
      setError("Unable to load pending posts.");
    } finally {
      setLoadingPosts(false);
    }
  };

  return (
    <>
      <AppHeader title="Post Approvals" showNotifications={false} />
      <ScreenContainer padded={false}>
        <View className="bg-white px-4 py-3">
          <SearchInput value={query} onChangeText={setQuery} placeholder="Search community to review" />
        </View>
        {!selectedCommunity ? (
          <View className="gap-3 p-4">
            {loadingCommunities ? <LoadingState message="Loading communities" /> : null}
            {!loadingCommunities && communities.length === 0 ? <EmptyState title="No communities found" /> : null}
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
            <View className="gap-3 p-4">
              {loadingPosts ? <LoadingState message="Loading pending posts" /> : null}
              {!loadingPosts && error ? <EmptyState title="Posts unavailable" message={error} icon="alert-circle-outline" /> : null}
              {!loadingPosts && !error && posts.length === 0 ? <EmptyState title="No pending posts" /> : null}
              {!loadingPosts &&
                !error &&
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPress={() =>
                      router.push({
                        pathname: "/admin/post-review",
                        params: { postId: post.id, communityId: selectedCommunity.id }
                      })
                    }
                  />
                ))}
            </View>
          </View>
        )}
      </ScreenContainer>
    </>
  );
}
