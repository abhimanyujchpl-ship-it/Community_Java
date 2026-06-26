import { useEffect, useState } from "react";
import { View } from "react-native";
import { AppHeader } from "@/components/common/AppHeader";
import { SearchInput } from "@/components/forms/SearchInput";
import { LoadingState } from "@/components/common/LoadingState";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { EmptyState } from "@/components/lists/EmptyState";
import { WhatsAppStyleListItem } from "@/components/lists/WhatsAppStyleListItem";
import { userService } from "@/services/user.service";
import { UserSummary } from "@/types";

export default function MembersScreen() {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);
      userService
        .list(query)
        .then(setMembers)
        .catch(() => setError("Unable to load members. Admin access is required."))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <AppHeader title="Members" showNotifications={false} />
      <ScreenContainer padded={false}>
        <View className="bg-white px-4 py-3">
          <SearchInput value={query} onChangeText={setQuery} placeholder="Search members" />
        </View>
        {loading ? <LoadingState message="Loading members" /> : null}
        {!loading && error ? (
          <View className="p-4">
            <EmptyState title="Members unavailable" message={error} icon="alert-circle-outline" />
          </View>
        ) : null}
        {!loading && !error && members.length === 0 ? (
          <View className="p-4">
            <EmptyState title="No members found" message="Try another name, email, or mobile number." />
          </View>
        ) : null}
        {!loading &&
          !error &&
          members.map((member) => (
            <WhatsAppStyleListItem
              key={member.id}
              title={member.fullName}
              subtitle={`${member.email} · ${member.mobile}`}
              rightText={member.role.replace(/_/g, " ")}
              badgeLabel={member.status}
              badgeTone={member.status === "ACTIVE" ? "success" : "warning"}
            />
          ))}
      </ScreenContainer>
    </>
  );
}
