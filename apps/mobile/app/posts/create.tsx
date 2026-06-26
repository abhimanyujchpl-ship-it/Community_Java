import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { PromoCard } from "@/components/cards/PromoCard";
import { InfoBox } from "@/components/common/InfoBox";
import { UploadTile } from "@/components/common/UploadTile";
import { AppSelect, SelectOption } from "@/components/forms/AppSelect";
import { AppTextInput } from "@/components/forms/AppTextInput";
import { AppHeader } from "@/components/layout/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { postService } from "@/services/post.service";
import { PostType } from "@/types";

type StitchPostCategory = "ANNOUNCEMENT" | "EVENT_UPDATE" | "GENERAL" | "NEWS";

const categoryOptions: SelectOption<StitchPostCategory>[] = [
  { label: "Announcement", value: "ANNOUNCEMENT" },
  { label: "Upcoming Event", value: "EVENT_UPDATE" },
  { label: "Community Discussion", value: "GENERAL" },
  { label: "Security Alert", value: "NEWS" }
];

const postSchema = z.object({
  postType: z.enum(["ANNOUNCEMENT", "EVENT_UPDATE", "GENERAL", "NEWS"]),
  title: z.string().trim().min(2, "Post title is required").max(180, "Post title is too long"),
  content: z.string().trim().min(2, "Post content is required").max(5000, "Post content is too long")
});

type PostForm = z.infer<typeof postSchema>;

export default function CreatePostScreen() {
  const { communityId } = useLocalSearchParams<{ communityId?: string }>();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { postType: "ANNOUNCEMENT", title: "", content: "" }
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
        postType: values.postType as PostType,
        title: values.title.trim(),
        content: values.content.trim()
      });
      Alert.alert("Submitted", "Your post will be visible after admin approval.");
      router.replace({ pathname: "/posts/details", params: { postId: post.id } });
    } catch {
      Alert.alert("Post not created", "Only approved community members can create posts.");
    }
  };

  return (
    <View style={styles.root}>
      <AppHeader title="Create Post" leftIcon="close" rightIcon="hub" onLeftPress={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <ScreenContainer>
          <View style={styles.content}>
            <InfoBox message="Your post will be visible after admin approval." />

            <View style={styles.form}>
              <AppSelect
                label="Post Category"
                value={postType}
                options={categoryOptions}
                onChange={(value) => setValue("postType", value, { shouldValidate: true })}
              />

              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <AppTextInput
                    label="Post Title"
                    value={field.value}
                    onChangeText={field.onChange}
                    placeholder="Give your post a clear title..."
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="content"
                render={({ field, fieldState }) => (
                  <AppTextInput
                    label="What's on your mind?"
                    value={field.value}
                    onChangeText={field.onChange}
                    placeholder="Share updates, details, or questions with the community..."
                    multiline
                    error={fieldState.error?.message}
                  />
                )}
              />

              <View style={styles.mediaSection}>
                <Text style={styles.sectionLabel}>Media & Documents</Text>
                <View style={styles.uploadRow}>
                  <UploadTile label="Add Photo" icon="add-a-photo" onPress={() => Alert.alert("Coming soon", "Photo upload will be connected next.")} />
                  <UploadTile label="Add File" icon="description" onPress={() => Alert.alert("Coming soon", "File upload will be connected next.")} />
                </View>
              </View>

              <PromoCard />

              <View style={styles.submitWrap}>
                <PrimaryButton
                  fullWidth
                  icon="send"
                  label="Submit for Approval"
                  loading={isSubmitting}
                  onPress={handleSubmit(submit)}
                />
              </View>
            </View>
          </View>
        </ScreenContainer>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  keyboard: {
    flex: 1
  },
  content: {
    width: "100%",
    maxWidth: 672,
    alignSelf: "center",
    gap: spacing.lg,
    paddingTop: spacing.sm
  },
  form: {
    gap: spacing.lg
  },
  mediaSection: {
    gap: spacing.xs
  },
  sectionLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginLeft: spacing.xs,
    fontFamily: typography.family
  },
  uploadRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  submitWrap: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl
  }
});
