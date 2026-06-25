import { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PostCard } from "@/components/cards/PostCard";
import { LoadingState } from "@/components/common/LoadingState";
import { AppHeader } from "@/components/headers/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { postService } from "@/services/post.service";
import { CommunityPost } from "@/types";

export default function PostDetailsScreen() {
  const { postId } = useLocalSearchParams<{ postId?: string }>();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setError("Post was not selected.");
      setLoading(false);
      return;
    }

    postService
      .details(postId)
      .then(setPost)
      .catch(() => setError("Unable to load this post."))
      .finally(() => setLoading(false));
  }, [postId]);

  return (
    <>
      <AppHeader title="Post Details" showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading post" /> : null}
        {!loading && error ? <EmptyState title="Post unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && post ? (
          <View>
            <PostCard post={post} />
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}
