import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/headers/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { postService } from "@/services/post.service";
import { PostType } from "@/types";

const postTypes: PostType[] = ["GENERAL", "ANNOUNCEMENT", "NEWS", "EVENT_UPDATE", "BIRTHDAY_WISH", "MATRIMONY", "DONATION_REQUEST"];

export default function CreatePostScreen() {
  const { communityId } = useLocalSearchParams<{ communityId?: string }>();
  const [postType, setPostType] = useState<PostType>("GENERAL");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!communityId) {
      Alert.alert("Community required", "Open a community before creating a post.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing details", "Add a title and content.");
      return;
    }

    setSubmitting(true);
    try {
      const post = await postService.create({
        communityId,
        postType,
        title: title.trim(),
        content: content.trim(),
        mediaUrl: mediaUrl.trim() || undefined
      });
      Alert.alert("Submitted", "Your post is pending admin approval.");
      router.replace({ pathname: "/posts/details", params: { postId: post.id } });
    } catch {
      Alert.alert("Post not created", "Only approved community members can create posts.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader title="Create Post" showNotifications={false} />
      <ScreenContainer>
        <View className="gap-4 rounded-xl border border-border bg-white p-4">
          <Text className="text-base font-semibold text-textDark">Post type</Text>
          <View className="flex-row flex-wrap gap-2">
            {postTypes.map((type) => (
              <Text
                key={type}
                className={`rounded-full px-3 py-2 text-sm font-semibold ${postType === type ? "bg-primary text-white" : "bg-lightBackground text-textGrey"}`}
                onPress={() => setPostType(type)}
              >
                {type.replaceAll("_", " ")}
              </Text>
            ))}
          </View>
          <TextField label="Title" value={title} onChangeText={setTitle} placeholder="Post title" />
          <TextField label="Content" value={content} onChangeText={setContent} placeholder="Write your update" multiline />
          <TextField label="Media URL" value={mediaUrl} onChangeText={setMediaUrl} placeholder="Optional image URL" />
          <PrimaryButton label="Submit for approval" loading={submitting} onPress={submit} />
        </View>
      </ScreenContainer>
    </>
  );
}
