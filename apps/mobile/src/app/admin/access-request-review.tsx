import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { LoadingState } from "@/components/common/LoadingState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/headers/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { accessRequestService } from "@/services/access-request.service";
import { AccessRequest } from "@/types";
import { accessRequestTone } from "@/utils/accessRequestStatus";

export default function AdminAccessRequestReviewScreen() {
  const { requestId, communityId } = useLocalSearchParams<{ requestId?: string; communityId?: string }>();
  const [request, setRequest] = useState<AccessRequest | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId || !communityId) {
      setError("Access request was not selected.");
      setLoading(false);
      return;
    }

    accessRequestService
      .byCommunity(communityId)
      .then((requests) => {
        const selected = requests.find((item) => item.id === requestId);
        if (!selected) {
          setError("Access request was not found.");
          return;
        }
        setRequest(selected);
      })
      .catch(() => setError("Unable to load access request."))
      .finally(() => setLoading(false));
  }, [communityId, requestId]);

  const approve = async () => {
    if (!request) {
      return;
    }

    setSubmitting(true);
    try {
      await accessRequestService.approve(request.id);
      Alert.alert("Approved", "The user has been added as a community member.");
      router.back();
    } catch {
      Alert.alert("Approval failed", "Only pending requests can be approved by admins.");
    } finally {
      setSubmitting(false);
    }
  };

  const reject = async () => {
    if (!request || !reason.trim()) {
      Alert.alert("Reason required", "Add a rejection reason before rejecting.");
      return;
    }

    setSubmitting(true);
    try {
      await accessRequestService.reject(request.id, reason.trim());
      Alert.alert("Rejected", "The request has been rejected.");
      router.back();
    } catch {
      Alert.alert("Rejection failed", "Only pending requests can be rejected by admins.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader title="Review Request" showNotifications={false} />
      <ScreenContainer>
        {loading ? <LoadingState message="Loading request" /> : null}
        {!loading && error ? <EmptyState title="Request unavailable" message={error} icon="alert-circle-outline" /> : null}
        {!loading && request ? (
          <View className="gap-4">
            <View className="items-center rounded-xl border border-border bg-white p-5">
              <UserAvatar name={request.user.fullName} size="lg" />
              <Text className="mt-3 text-xl font-bold text-textDark">{request.user.fullName}</Text>
              <Text className="mt-1 text-sm text-textGrey">{request.user.mobile}</Text>
              <Text className="mt-1 text-sm text-textGrey">{request.user.email}</Text>
              <View className="mt-3">
                <StatusBadge label={request.status} tone={accessRequestTone(request.status)} />
              </View>
            </View>
            <View className="rounded-xl border border-border bg-white p-4">
              <Text className="text-sm font-semibold text-textGrey">Community</Text>
              <Text className="mt-1 text-lg font-bold text-textDark">{request.community.name}</Text>
              <Text className="mt-1 text-sm text-textGrey">
                {request.community.city}, {request.community.state}
              </Text>
            </View>
            <View className="rounded-xl border border-border bg-white p-4">
              <Text className="text-sm font-semibold text-textGrey">Request message</Text>
              <Text className="mt-2 text-sm leading-5 text-textDark">{request.requestMessage ?? "No message provided."}</Text>
            </View>
            <TextField
              label="Rejection reason"
              value={reason}
              onChangeText={setReason}
              placeholder="Required only when rejecting"
              multiline
            />
            <PrimaryButton label="Approve request" loading={submitting} onPress={approve} />
            <SecondaryButton label="Reject request" disabled={submitting} onPress={reject} />
          </View>
        ) : null}
      </ScreenContainer>
    </>
  );
}
