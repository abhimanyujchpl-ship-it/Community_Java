import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { PostCard } from "@/components/cards/PostCard";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/headers/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { postService } from "@/services/post.service";
import { CommunityPost } from "@/types";

export default function MyPostsScreen() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    postService
      .mine()
      .then(setPosts)
      .catch(() => setError("Unable to load your posts."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AppHeader title="My Posts" showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading posts" /> : null}
        {!loading && error ? <EmptyState title="Posts unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && !error && posts.length === 0 ? <EmptyState title="No posts yet" message="Create a post from a community." /> : null}
        <View className="gap-3">
          {!loading &&
            !error &&
            posts.map((post) => (
              <PostCard key={post.id} post={post} onPress={() => router.push({ pathname: "/posts/details", params: { postId: post.id } })} />
            ))}
        </View>
      </ScreenContainer>
    </>
  );
}
