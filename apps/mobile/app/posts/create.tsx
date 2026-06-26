import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import { z } from "zod";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { postService } from "@/services/post.service";
import { PostType } from "@/types";

const postTypes: PostType[] = ["GENERAL", "ANNOUNCEMENT", "NEWS", "EVENT_UPDATE", "BIRTHDAY_WISH", "MATRIMONY", "DONATION_REQUEST"];

const postSchema = z.object({
  postType: z.enum(["GENERAL", "ANNOUNCEMENT", "NEWS", "EVENT_UPDATE", "BIRTHDAY_WISH", "MATRIMONY", "DONATION_REQUEST"]),
  title: z.string().min(2, "Title is required").max(180, "Title is too long"),
  content: z.string().min(2, "Content is required").max(5000, "Content is too long"),
  mediaUrl: z.string().optional()
});

type PostForm = z.infer<typeof postSchema>;

export default function CreatePostScreen() {
  const { communityId } = useLocalSearchParams<{ communityId?: string }>();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { postType: "GENERAL", title: "", content: "", mediaUrl: "" }
  });

  const postType = watch("postType");

  const submit = async (values: PostForm) => {
    if (!communityId) {
      Alert.alert("Community required", "Open a community before creating a post.");
      return;
    }

    try {
      const post = await postService.create({
        communityId,
        postType: values.postType,
        title: values.title.trim(),
        content: values.content.trim(),
        mediaUrl: values.mediaUrl?.trim() || undefined
      });
      Alert.alert("Submitted", "Your post is pending admin approval.");
      router.replace({ pathname: "/posts/details", params: { postId: post.id } });
    } catch {
      Alert.alert("Post not created", "Only approved community members can create posts.");
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
                onPress={() => setValue("postType", type, { shouldValidate: true })}
              >
                {type.replaceAll("_", " ")}
              </Text>
            ))}
          </View>
          <Controller
            control={control}
            name="title"
            render={({ field, fieldState }) => (
              <TextField label="Title" value={field.value} onChangeText={field.onChange} placeholder="Post title" error={fieldState.error?.message} />
            )}
          />
          <Controller
            control={control}
            name="content"
            render={({ field, fieldState }) => (
              <TextField label="Content" value={field.value} onChangeText={field.onChange} placeholder="Write your update" multiline error={fieldState.error?.message} />
            )}
          />
          <Controller
            control={control}
            name="mediaUrl"
            render={({ field, fieldState }) => (
              <TextField label="Media URL" value={field.value} onChangeText={field.onChange} placeholder="Optional image URL" error={fieldState.error?.message} />
            )}
          />
          <PrimaryButton label="Submit for approval" loading={isSubmitting} onPress={handleSubmit(submit)} />
        </View>
      </ScreenContainer>
    </>
  );
}
