import { useEffect, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FloatingActionButton } from "@/components/buttons/FloatingActionButton";
import { PostCard } from "@/components/cards/PostCard";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { postService } from "@/services/post.service";
import { CommunityPost } from "@/types";

export default function FeedScreen() {
  const { communityId } = useLocalSearchParams<{ communityId?: string }>();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!communityId) {
      setError("Community was not selected.");
      setLoading(false);
      return;
    }

    postService
      .feed(communityId)
      .then(setPosts)
      .catch(() => setError("Unable to load feed."))
      .finally(() => setLoading(false));
  }, [communityId]);

  return (
    <>
      <AppHeader title="Community Feed" showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading feed" /> : null}
        {!loading && error ? <EmptyState title="Feed unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && !error && posts.length === 0 ? (
          <EmptyState title="No posts yet" message="Approved community posts will appear here." />
        ) : null}
        <View className="gap-3">
          {!loading &&
            !error &&
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showStatus={false}
                onPress={() => router.push({ pathname: "/posts/details", params: { postId: post.id } })}
              />
            ))}
        </View>
        {communityId ? (
          <FloatingActionButton
            icon="create-outline"
            onPress={() => router.push({ pathname: "/posts/create", params: { communityId } })}
          />
        ) : null}
      </ScreenContainer>
    </>
  );
}
