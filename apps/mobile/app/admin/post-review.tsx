import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { PostCard } from "@/components/cards/PostCard";
import { LoadingState } from "@/components/common/LoadingState";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { postService } from "@/services/post.service";
import { CommunityPost } from "@/types";

export default function AdminPostReviewScreen() {
  const { postId } = useLocalSearchParams<{ postId?: string; communityId?: string }>();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
      .catch(() => setError("Unable to load post."))
      .finally(() => setLoading(false));
  }, [postId]);

  const approve = async () => {
    if (!post) {
      return;
    }
    setSubmitting(true);
    try {
      await postService.approve(post.id);
      Alert.alert("Approved", "The post is now visible in the feed.");
      router.back();
    } catch {
      Alert.alert("Approval failed", "Only admins can approve pending posts, and authors cannot approve their own posts.");
    } finally {
      setSubmitting(false);
    }
  };

  const reject = async () => {
    if (!post || !reason.trim()) {
      Alert.alert("Reason required", "Add a rejection reason before rejecting.");
      return;
    }
    setSubmitting(true);
    try {
      await postService.reject(post.id, reason.trim());
      Alert.alert("Rejected", "The author can see the rejection reason in My Posts.");
      router.back();
    } catch {
      Alert.alert("Rejection failed", "Only pending posts can be rejected.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader title="Review Post" showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading post" /> : null}
        {!loading && error ? <EmptyState title="Post unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && post ? (
          <View className="gap-4">
            <PostCard post={post} />
            <TextField
              label="Rejection reason"
              value={reason}
              onChangeText={setReason}
              placeholder="Required only when rejecting"
              multiline
            />
            <PrimaryButton label="Approve post" loading={submitting} onPress={approve} />
            <SecondaryButton label="Reject post" disabled={submitting} onPress={reject} />
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}
