import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { DashboardLayout, StatCard, WebAvatar, WebBadge, WebButton, WebCard } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const posts = [
  ["Aarav Mehta", "20 min ago", "Announcement", "Water supply maintenance", "Please store water before the Sunday maintenance window."],
  ["Priya Nair", "1 hr ago", "Discussion", "Weekend clean-up volunteers", "Join us near the clubhouse for a quick clean-up drive."]
];

export default function FeedPage() {
  return (
    <DashboardLayout
      title="Member Dashboard"
      nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}
      right={
        <>
          <WebCard><Text style={styles.panelTitle}>Pending status</Text><Text style={styles.muted}>Your Green Valley request is approved.</Text></WebCard>
          <WebCard><Text style={styles.panelTitle}>Quick actions</Text><View style={styles.stack}><WebButton label="Create Post" onPress={() => router.push("/posts/create")} /><WebButton label="Browse Communities" variant="secondary" onPress={() => router.push("/community/search")} /></View></WebCard>
        </>
      }
    >
      <View style={styles.stats}>
        <StatCard label="Communities" value="3" icon="groups" />
        <StatCard label="Unread Alerts" value="12" icon="notifications" />
        <StatCard label="Upcoming Events" value="5" icon="event" />
      </View>
      <WebCard style={styles.welcome}>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.muted}>Here is what is happening across your communities today.</Text>
      </WebCard>
      <WebCard style={styles.composer}>
        <WebAvatar name="You" />
        <View style={styles.composerInput}><Text style={styles.muted}>Share an update with your community</Text></View>
        <WebButton label="Create Post" icon="edit" onPress={() => router.push("/posts/create")} />
      </WebCard>
      {posts.map(([author, time, type, title, content]) => (
        <WebCard key={title} style={styles.post}>
          <View style={styles.postHeader}><WebAvatar name={author} /><View style={{ flex: 1 }}><Text style={styles.author}>{author}</Text><Text style={styles.muted}>{time}</Text></View><WebBadge label={type} /></View>
          <Text style={styles.postTitle}>{title}</Text>
          <Text style={styles.muted}>{content}</Text>
          <View style={styles.media}><MaterialIcons name="image" size={28} color={colors.primary} /></View>
          <View style={styles.postActions}><Text style={styles.action}>Like</Text><Text style={styles.action}>Comment</Text></View>
        </WebCard>
      ))}
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: "row", gap: spacing.md, flexWrap: "wrap" },
  welcome: { gap: spacing.xs },
  heading: { ...typography.headlineSm, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  panelTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold, marginBottom: spacing.sm },
  stack: { gap: spacing.sm },
  composer: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  composerInput: { flex: 1, minHeight: 46, borderRadius: radius.full, justifyContent: "center", paddingHorizontal: spacing.md, backgroundColor: colors.surfaceContainerLow },
  post: { gap: spacing.md },
  postHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  author: { color: colors.onSurface, fontWeight: "800" },
  postTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  media: { height: 150, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceContainerLow },
  postActions: { flexDirection: "row", gap: spacing.lg, borderTopWidth: 1, borderTopColor: colors.outlineVariant, paddingTop: spacing.md },
  action: { color: colors.primary, fontWeight: "800" }
});
