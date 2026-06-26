import { StyleSheet, Text, View } from "react-native";
import { DashboardLayout, WebAvatar, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const requests = [
  ["Rohan Sharma", "Pune", "Please approve my resident access.", "Today"],
  ["Meera Iyer", "Pune", "I recently moved to Tower B.", "Yesterday"],
  ["Karan Patel", "Mumbai", "Joining for event updates.", "Jun 25"]
];

export default function AdminAccessRequestsScreen() {
  return (
    <DashboardLayout title="Access Requests" nav={["Dashboard", "Access Requests", "Post Approvals", "Members", "Events", "Settings"]}>
      <WebCard style={styles.table}>
        <Text style={styles.heading}>Pending access requests</Text>
        {requests.map(([name, city, message, date]) => (
          <View key={name} style={styles.row}>
            <WebAvatar name={name} />
            <View style={styles.nameCell}>
              <Text style={styles.rowTitle}>{name}</Text>
              <Text style={styles.muted}>{city}</Text>
            </View>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.date}>{date}</Text>
            <WebBadge label="Pending" tone="warning" />
            <View style={styles.actions}>
              <WebButton label="Approve" />
              <WebButton label="Reject" variant="danger" />
            </View>
          </View>
        ))}
      </WebCard>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  table: { gap: spacing.md },
  heading: { ...typography.headlineSm, color: colors.onSurface, fontFamily: typography.familyBold },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.outlineVariant },
  nameCell: { width: 160 },
  rowTitle: { color: colors.onSurface, fontWeight: "800" },
  muted: { color: colors.textGrey },
  message: { flex: 1, color: colors.onSurfaceVariant },
  date: { width: 90, color: colors.textGrey, fontWeight: "700" },
  actions: { flexDirection: "row", gap: spacing.sm }
});
