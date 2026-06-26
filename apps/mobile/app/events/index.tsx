import { StyleSheet, Text, View } from "react-native";
import { DashboardLayout, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const events = [
  ["27", "Jun", "Community town hall", "6:30 PM", "Clubhouse", "Upcoming"],
  ["02", "Jul", "Health camp", "10:00 AM", "Main lobby", "Upcoming"],
  ["08", "Jul", "Children's art workshop", "4:00 PM", "Activity room", "Upcoming"]
];

export default function EventsPage() {
  return (
    <DashboardLayout title="Events" nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Upcoming Events</Text>
          <Text style={styles.muted}>Plan, track, and remind members about community events.</Text>
        </View>
        <WebButton label="Create Event" icon="add" />
      </View>
      <View style={styles.grid}>
        <View style={styles.list}>
          {events.map(([day, month, title, time, location, status]) => (
            <WebCard key={title} style={styles.eventCard}>
              <View style={styles.dateBlock}>
                <Text style={styles.month}>{month}</Text>
                <Text style={styles.day}>{day}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{title}</Text>
                <Text style={styles.muted}>{time} • {location}</Text>
              </View>
              <WebBadge label={status} tone="success" />
            </WebCard>
          ))}
        </View>
        <WebCard style={styles.calendar}>
          <Text style={styles.eventTitle}>Calendar Preview</Text>
          <View style={styles.calendarGrid}>
            {Array.from({ length: 35 }, (_, index) => (
              <View key={index} style={[styles.calendarCell, [6, 11, 18].includes(index) ? styles.calendarActive : null]}>
                <Text style={[styles.calendarText, [6, 11, 18].includes(index) ? styles.calendarActiveText : null]}>{index + 1}</Text>
              </View>
            ))}
          </View>
        </WebCard>
      </View>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  heading: { ...typography.headlineMd, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, marginTop: 4 },
  grid: { flexDirection: "row", gap: spacing.lg, flexWrap: "wrap" },
  list: { flex: 1, minWidth: 420, gap: spacing.md },
  eventCard: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  dateBlock: { width: 64, height: 72, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  month: { color: colors.accentGreen, fontWeight: "800", textTransform: "uppercase" },
  day: { color: colors.onPrimary, fontSize: 26, fontWeight: "900" },
  eventTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  calendar: { width: 360, gap: spacing.md },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  calendarCell: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceContainerLow },
  calendarActive: { backgroundColor: colors.accentGreen },
  calendarText: { color: colors.onSurfaceVariant, fontWeight: "700" },
  calendarActiveText: { color: colors.primary }
});
