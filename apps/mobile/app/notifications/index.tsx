import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { DashboardLayout, WebButton, WebCard } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const notifications = [
  ["Post approved", "Your water maintenance post is now visible.", "2 min ago", true, "check-circle"],
  ["New event", "Community town hall has been scheduled.", "1 hr ago", true, "event"],
  ["Access request", "Your Lakeview request is pending review.", "Yesterday", false, "person-add"]
] as const;

export default function NotificationsPage() {
  return (
    <DashboardLayout title="Notifications" nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Notifications</Text>
          <Text style={styles.muted}>Unread updates, approvals, events, and reminders.</Text>
        </View>
        <WebButton label="Mark all as read" variant="secondary" icon="done-all" />
      </View>
      <WebCard style={styles.list}>
        {notifications.map(([title, body, time, unread, icon]) => (
          <View key={title} style={[styles.row, unread ? styles.unread : null]}>
            <View style={styles.icon}>
              <MaterialIcons name={icon} size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{title}</Text>
              <Text style={styles.muted}>{body}</Text>
            </View>
            <Text style={styles.time}>{time}</Text>
          </View>
        ))}
      </WebCard>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  heading: { ...typography.headlineMd, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, marginTop: 4 },
  list: { padding: 0, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  unread: { backgroundColor: colors.surfaceContainerLow },
  icon: { width: 46, height: 46, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceContainer },
  rowTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  time: { color: colors.textGrey, fontWeight: "700" }
});
