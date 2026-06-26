import { StyleSheet, Text, View } from "react-native";
import { DashboardLayout, WebAvatar, WebBadge, WebButton, WebCard, WebTextarea } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const posts = [
  ["Aarav Mehta", "Announcement", "Water supply maintenance", "Please store water before the Sunday maintenance window."],
  ["Priya Nair", "Discussion", "Weekend clean-up volunteers", "Join us for a clubhouse clean-up drive."]
];

export default function AdminPostApprovalsScreen() {
  return (
    <DashboardLayout title="Post Approvals" nav={["Dashboard", "Access Requests", "Post Approvals", "Members", "Events", "Settings"]}>
      <View style={styles.grid}>
        {posts.map(([author, type, title, content]) => (
          <WebCard key={title} style={styles.card}>
            <View style={styles.header}>
              <WebAvatar name={author} />
              <View style={{ flex: 1 }}>
                <Text style={styles.author}>{author}</Text>
                <Text style={styles.muted}>Submitted for review</Text>
              </View>
              <WebBadge label={type} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.muted}>{content}</Text>
            <View style={styles.media}><Text style={styles.muted}>Media preview</Text></View>
            <WebTextarea label="Rejection reason" placeholder="Add reason before rejecting..." />
            <View style={styles.actions}>
              <WebButton label="Approve" icon="check" />
              <WebButton label="Reject" variant="danger" icon="close" />
            </View>
          </WebCard>
        ))}
      </View>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  card: { width: "48%", minWidth: 360, gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  author: { color: colors.onSurface, fontWeight: "800" },
  title: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  media: { height: 120, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceContainerLow },
  actions: { flexDirection: "row", gap: spacing.sm }
});
