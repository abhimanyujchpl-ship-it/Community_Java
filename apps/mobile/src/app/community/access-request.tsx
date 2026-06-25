import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CommunityCard } from "@/components/cards/CommunityCard";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { LoadingState } from "@/components/common/LoadingState";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/headers/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { accessRequestService } from "@/services/access-request.service";
import { communityService } from "@/services/community.service";
import { CommunitySummary } from "@/types";

export default function AccessRequestScreen() {
  const { communityId } = useLocalSearchParams<{ communityId?: string }>();
  const [community, setCommunity] = useState<CommunitySummary | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!communityId) {
      setError("Community was not selected.");
      setLoading(false);
      return;
    }

    communityService
      .getById(communityId)
      .then(setCommunity)
      .catch(() => setError("Unable to load community."))
      .finally(() => setLoading(false));
  }, [communityId]);

  const submitRequest = async () => {
    if (!communityId) {
      return;
    }

    setSubmitting(true);
    try {
      await accessRequestService.create({ communityId, requestMessage: requestMessage.trim() || undefined });
      Alert.alert("Request sent", "Your join request is now pending admin review.");
      router.replace("/community/request-status");
    } catch {
      Alert.alert("Request not sent", "You may already have an active request for this community.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader title="Join Request" showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Preparing request" /> : null}
        {!loading && error ? <EmptyState title="Unable to continue" message={error} icon="alert-circle-outline" /> : null}
        {!loading && community ? (
          <View className="gap-4">
            <CommunityCard community={community} />
            <View className="rounded-xl border border-border bg-white p-4">
              <Text className="mb-3 text-base font-semibold text-textDark">Message to admin</Text>
              <TextField
                label="Request message"
                value={requestMessage}
                onChangeText={setRequestMessage}
                placeholder="Share your apartment, address, or reason to join"
                multiline
              />
            </View>
            <PrimaryButton label="Send request" loading={submitting} onPress={submitRequest} />
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}
