import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { DashboardLayout, WebButton, WebCard, WebInput, WebSelect, WebTextarea } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { accessRequestService } from "@/services/access-request.service";
import { postService } from "@/services/post.service";
import { useCommunityStore } from "@/store/community.store";
import { CommunitySummary } from "@/types";
import { findApprovedRequest } from "@/utils/communityAccess";

type CreatePostType = "ANNOUNCEMENT" | "GENERAL" | "EVENT_UPDATE" | "NEWS" | "BIRTHDAY_WISH" | "DONATION_REQUEST";

const postTypes: Array<{ label: string; value: CreatePostType }> = [
  { label: "Announcement", value: "ANNOUNCEMENT" },
  { label: "General Post", value: "GENERAL" },
  { label: "Event Update", value: "EVENT_UPDATE" },
  { label: "News", value: "NEWS" },
  { label: "Birthday / Wishes", value: "BIRTHDAY_WISH" },
  { label: "Donation / Support Request", value: "DONATION_REQUEST" }
];

const postSchema = z.object({
  postType: z.enum(["ANNOUNCEMENT", "GENERAL", "EVENT_UPDATE", "NEWS", "BIRTHDAY_WISH", "DONATION_REQUEST"]),
  title: z.string().trim().min(2, "Post title is required").max(180, "Post title is too long"),
  content: z.string().trim().min(2, "Post content is required").max(5000, "Post content is too long"),
  mediaUrl: z.string().trim().max(500, "Media URL is too long").optional()
});

type PostForm = z.infer<typeof postSchema>;

function apiError(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError.response) {
    return "Backend not reachable. Please start server on port 8080.";
  }
  return axiosError.response.data?.message ?? fallback;
}

export default function CreatePostScreen() {
  const { communityId: routeCommunityId } = useLocalSearchParams<{ communityId?: string }>();
  const activeCommunity = useCommunityStore((state) => state.activeCommunity);
  const setActiveCommunity = useCommunityStore((state) => state.setActiveCommunity);
  const [community, setCommunity] = useState<CommunitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { postType: "GENERAL", title: "", content: "", mediaUrl: "" }
  });

  const postType = watch("postType");
  const selectedType = postTypes.find((type) => type.value === postType);

  useEffect(() => {
    const loadCommunity = async () => {
      setLoading(true);
      setError(null);
      try {
        const requests = await accessRequestService.mine();
        const approved = findApprovedRequest(requests, routeCommunityId ?? activeCommunity?.id);
        if (!approved) {
          setCommunity(null);
          return;
        }
        setCommunity(approved.community);
        setActiveCommunity(approved.community);
      } catch (requestError) {
        setError(apiError(requestError, "Unable to verify community membership."));
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [activeCommunity?.id, routeCommunityId, setActiveCommunity]);

  const submit = async (values: PostForm) => {
    if (!community) {
      setStatus({ tone: "error", message: "Approved community membership is required before creating a post." });
      return;
    }

    setStatus(null);
    try {
      await postService.create({
        communityId: community.id,
        postType: values.postType,
        title: values.title.trim(),
        content: values.content.trim(),
        mediaUrl: values.mediaUrl?.trim() || undefined
      });
      setStatus({ tone: "success", message: "Post submitted for admin approval." });
      router.replace("/posts/my-posts");
    } catch (requestError) {
      setStatus({ tone: "error", message: apiError(requestError, "Only approved community members can create posts.") });
    }
  };

  return (
    <DashboardLayout title="Create Post" nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}>
      <ScrollView contentContainerStyle={styles.page}>
        {loading ? <LoadingState message="Checking community access" /> : null}
        {!loading && error ? <EmptyState title="Create post unavailable" message={error} icon="lock" /> : null}
        {!loading && !error && !community ? (
          <WebCard style={styles.stack}>
            <Text style={styles.heading}>Approved community required</Text>
            <Text style={styles.muted}>Request access to a community before submitting posts for approval.</Text>
            <WebButton label="Browse Communities" onPress={() => router.push("/community/search")} />
          </WebCard>
        ) : null}

        {!loading && !error && community ? (
          <WebCard style={styles.formCard}>
            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={22} color={colors.primary} />
              <Text style={styles.infoText}>Your post will be visible after admin approval.</Text>
            </View>
            <Text style={styles.communityText}>Posting to {community.name}</Text>

            <WebSelect label="Post Category" value={selectedType?.label ?? "Select category"} onPress={() => setCategoryOpen(true)} />

            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <WebInput label="Post Title" placeholder="Give your post a clear title" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
              )}
            />

            <Controller
              control={control}
              name="content"
              render={({ field, fieldState }) => (
                <WebTextarea label="Content" placeholder="Share updates, details, or questions with the community" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
              )}
            />

            <Controller
              control={control}
              name="mediaUrl"
              render={({ field, fieldState }) => (
                <WebInput label="Media URL" placeholder="Optional image or document URL" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
              )}
            />

            <View style={styles.uploadRow}>
              <Pressable style={styles.uploadTile} onPress={() => setStatus({ tone: "error", message: "Media upload storage is not connected yet. Paste a media URL for now." })}>
                <MaterialIcons name="add-a-photo" size={24} color={colors.primary} />
                <Text style={styles.uploadText}>Add Photo</Text>
              </Pressable>
              <Pressable style={styles.uploadTile} onPress={() => setStatus({ tone: "error", message: "Document upload storage is not connected yet. Paste a document URL for now." })}>
                <MaterialIcons name="description" size={24} color={colors.primary} />
                <Text style={styles.uploadText}>Add File</Text>
              </Pressable>
            </View>

            {status ? <Text style={[styles.toast, status.tone === "success" ? styles.toastSuccess : styles.toastError]}>{status.message}</Text> : null}

            <WebButton label={isSubmitting ? "Submitting..." : "Submit for Approval"} icon="send" onPress={handleSubmit(submit)} />
          </WebCard>
        ) : null}
      </ScrollView>

      <Modal visible={categoryOpen} transparent animationType="fade" onRequestClose={() => setCategoryOpen(false)}>
        <View style={styles.modalBackdrop}>
          <WebCard style={styles.modalCard}>
            <Text style={styles.heading}>Post Category</Text>
            {postTypes.map((type) => (
              <Pressable
                key={type.value}
                style={[styles.option, postType === type.value ? styles.optionActive : null]}
                onPress={() => {
                  setValue("postType", type.value, { shouldValidate: true });
                  setCategoryOpen(false);
                }}
              >
                <Text style={[styles.optionText, postType === type.value ? styles.optionTextActive : null]}>{type.label}</Text>
              </Pressable>
            ))}
          </WebCard>
        </View>
      </Modal>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  formCard: { gap: spacing.lg, maxWidth: 760, width: "100%" },
  stack: { gap: spacing.md },
  heading: { ...typography.headlineSm, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  infoBox: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderRadius: radius.default, padding: spacing.md, backgroundColor: colors.surfaceContainerLow },
  infoText: { color: colors.onSurface, fontWeight: "700" },
  communityText: { color: colors.primary, fontWeight: "800" },
  uploadRow: { flexDirection: "row", gap: spacing.md, flexWrap: "wrap" },
  uploadTile: { flex: 1, minWidth: 180, minHeight: 92, borderRadius: radius.default, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.surfaceContainerLow },
  uploadText: { color: colors.primary, fontWeight: "800" },
  toast: { borderRadius: radius.default, padding: spacing.md, textAlign: "center", fontWeight: "700" },
  toastSuccess: { color: colors.success, backgroundColor: "#dcfce7" },
  toastError: { color: colors.error, backgroundColor: colors.errorContainer },
  modalBackdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.md, backgroundColor: "rgba(0,0,0,0.35)" },
  modalCard: { width: "100%", maxWidth: 460, gap: spacing.sm },
  option: { borderRadius: radius.default, padding: spacing.md, backgroundColor: colors.surfaceContainerLow },
  optionActive: { backgroundColor: colors.primary },
  optionText: { color: colors.primary, fontWeight: "800" },
  optionTextActive: { color: colors.onPrimary }
});
