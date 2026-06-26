import { StyleSheet, Text, View } from "react-native";
import { DashboardLayout, StatCard, WebAvatar, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export default function AdminDashboardScreen() {
  return (
    <DashboardLayout
      title="Admin Dashboard"
      nav={["Dashboard", "Access Requests", "Post Approvals", "Members", "Events", "Settings"]}
      right={
        <WebCard style={styles.stack}>
          <Text style={styles.heading}>Quick actions</Text>
          <WebButton label="Review Requests" />
          <WebButton label="Approve Posts" variant="secondary" />
          <WebButton label="Create Event" variant="secondary" />
        </WebCard>
      }
    >
      <View style={styles.stats}>
        <StatCard label="Total Members" value="1,248" icon="groups" />
        <StatCard label="Pending Requests" value="18" icon="person-add" />
        <StatCard label="Pending Posts" value="9" icon="rate-review" />
        <StatCard label="Upcoming Events" value="5" icon="event" />
      </View>
      <View style={styles.grid}>
        <WebCard style={styles.stack}>
          <Text style={styles.heading}>Pending requests</Text>
          {["Rohan Sharma", "Meera Iyer", "Karan Patel"].map((name) => (
            <View key={name} style={styles.row}>
              <WebAvatar name={name} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{name}</Text>
                <Text style={styles.muted}>Requested access to Green Valley</Text>
              </View>
              <WebBadge label="Pending" tone="warning" />
            </View>
          ))}
        </WebCard>
        <WebCard style={styles.stack}>
          <Text style={styles.heading}>Pending post approvals</Text>
          {["Water maintenance notice", "Weekend clean-up drive", "Security gate update"].map((title) => (
            <View key={title} style={styles.row}>
              <View style={styles.dot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{title}</Text>
                <Text style={styles.muted}>Submitted for admin review</Text>
              </View>
              <WebButton label="Review" variant="ghost" />
            </View>
          ))}
        </WebCard>
      </View>
      <WebCard style={styles.stack}>
        <Text style={styles.heading}>Recent activity</Text>
        {["Access request approved", "Event created: Town hall", "Post approved: Water update"].map((item) => (
          <Text key={item} style={styles.muted}>{item}</Text>
        ))}
      </WebCard>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: "row", gap: spacing.md, flexWrap: "wrap" },
  grid: { flexDirection: "row", gap: spacing.md, flexWrap: "wrap" },
  stack: { gap: spacing.md },
  heading: { ...typography.headlineSm, color: colors.onSurface, fontFamily: typography.familyBold },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm },
  rowTitle: { color: colors.onSurface, fontWeight: "800" },
  muted: { color: colors.textGrey, lineHeight: 22 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accentGreen }
});
