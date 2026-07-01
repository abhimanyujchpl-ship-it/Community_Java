import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardLayout, WebAvatar, WebBadge, WebCard, WebInput } from "@/components/web/WebKit";
import { EmptyState } from "@/components/web/EmptyState";
import { LoadingState } from "@/components/web/LoadingState";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { userService } from "@/services/user.service";
import { UserSummary } from "@/types";

function apiError(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError.response) {
    return "Backend not reachable. Please start server on port 8080.";
  }
  return axiosError.response.data?.message ?? fallback;
}

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
        .catch((requestError) => setError(apiError(requestError, "Unable to load members.")))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <DashboardLayout title="Members" nav={["Dashboard", "Access Requests", "Post Approvals", "Members", "Events", "Settings"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <WebCard style={styles.searchCard}>
          <WebInput label="Search members" placeholder="Search by name, email, or mobile" value={query} onChangeText={setQuery} />
        </WebCard>
        {loading ? <LoadingState message="Loading members" /> : null}
        {!loading && error ? <EmptyState title="Members unavailable" message={error} icon="error-outline" /> : null}
        {!loading && !error && members.length === 0 ? <EmptyState title="No members found" message="Try another name, email, or mobile number." /> : null}
        <View style={styles.grid}>
          {!loading && !error && members.map((member) => (
            <WebCard key={member.id} style={styles.memberCard}>
              <WebAvatar name={member.fullName} />
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{member.fullName}</Text>
                <Text style={styles.muted}>{member.email}</Text>
                <Text style={styles.muted}>{member.mobile}</Text>
              </View>
              <View style={styles.badges}>
                <WebBadge label={member.role.replace(/_/g, " ")} />
                <WebBadge label={member.status} tone={member.status === "ACTIVE" ? "success" : "warning"} />
              </View>
            </WebCard>
          ))}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  searchCard: { maxWidth: 760 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  memberCard: { width: "48%", minWidth: 300, flexDirection: "row", alignItems: "center", gap: spacing.md },
  memberName: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  badges: { gap: spacing.sm, alignItems: "flex-end" }
});

