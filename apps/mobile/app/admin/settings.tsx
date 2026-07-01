import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardLayout, WebButton, WebCard } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const settings = [
  ["Community settings", "Review community profile, visibility, and dashboard data.", "/admin/dashboard"],
  ["Approval rules", "Manage access requests and post moderation queues.", "/admin/access-requests"],
  ["Member directory", "Search and review active member accounts.", "/admin/members"],
  ["Event operations", "Create, cancel, and complete community events.", "/admin/events"]
] as const;

export default function AdminSettingsScreen() {
  return (
    <DashboardLayout title="Settings" nav={["Dashboard", "Access Requests", "Post Approvals", "Members", "Events", "Settings"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <WebCard style={styles.hero}>
          <Text style={styles.heading}>Admin settings</Text>
          <Text style={styles.muted}>Operational controls are grouped by workflow so admins can move quickly without hunting through menus.</Text>
        </WebCard>
        <View style={styles.grid}>
          {settings.map(([title, subtitle, route]) => (
            <WebCard key={title} style={styles.card}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.muted}>{subtitle}</Text>
              <WebButton label="Open" variant="secondary" onPress={() => router.push(route as never)} />
            </WebCard>
          ))}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  hero: { gap: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  card: { width: "48%", minWidth: 300, gap: spacing.md },
  heading: { ...typography.headlineMd, color: colors.onSurface, fontFamily: typography.familyBold },
  cardTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 }
});

