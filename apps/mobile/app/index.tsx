import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { Pressable, Platform, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LoadingState } from "@/components/common/LoadingState";
import { PublicNavbar, WebBadge, WebButton, WebCard, WebSection, WebShell } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useAuthStore } from "@/store/auth.store";

const features = [
  ["Member Profiles", "Verified member records with role and access status.", "person"],
  ["Community Access", "Approve requests and keep private spaces protected.", "verified-user"],
  ["Post Approval", "Review posts before they appear in the community feed.", "rate-review"],
  ["Event Calendar", "Create events, reminders, and calendar views.", "event"],
  ["Notifications", "Unread counts and alerts for important updates.", "notifications"],
  ["Admin Dashboard", "Track members, posts, requests, events, and activity.", "dashboard"]
] as const;

export default function LandingPage() {
  const { width } = useWindowDimensions();
  const { bootstrapped, isAuthenticated, user } = useAuthStore();
  const compact = width < 760;

  if (Platform.OS !== "web") {
    if (!bootstrapped) {
      return <LoadingState message="Opening app" />;
    }

    if (!isAuthenticated) {
      return <Redirect href="/auth/login" />;
    }

    return <Redirect href={user?.role === "MEMBER" ? "/tabs/feed" : "/admin/dashboard"} />;
  }

  return (
    <WebShell>
      <PublicNavbar onNavigate={(path) => router.push(path as never)} />
      <WebSection>
        <View style={[styles.hero, compact ? styles.heroCompact : null]}>
          <View style={styles.heroCopy}>
            <WebBadge label="WhatsApp-inspired community platform" tone="success" />
            <Text style={[styles.heroTitle, compact ? styles.heroTitleCompact : null]}>Manage your community in one simple platform</Text>
            <Text style={styles.heroSubtitle}>
              Join communities, manage members, approve posts, schedule events, and send reminders from a calm professional workspace.
            </Text>
            <View style={styles.heroActions}>
              <WebButton label="Create Account" icon="person-add-alt" onPress={() => router.push("/auth/register")} />
              <WebButton label="Browse Communities" variant="secondary" icon="search" onPress={() => router.push("/community/search")} />
            </View>
          </View>
          <WebCard style={styles.preview}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Green Valley Residents</Text>
              <WebBadge label="Live" tone="success" />
            </View>
            {[
              ["Community feed", "3 approved updates today", "forum"],
              ["Pending approvals", "8 access requests waiting", "pending-actions"],
              ["Upcoming events", "Meetup tomorrow, 6:30 PM", "event"]
            ].map(([title, body, icon]) => (
              <View key={title} style={styles.previewRow}>
                <View style={styles.previewIcon}><MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={20} color={colors.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewRowTitle}>{title}</Text>
                  <Text style={styles.previewRowBody}>{body}</Text>
                </View>
              </View>
            ))}
          </WebCard>
        </View>

        <View style={styles.featureGrid}>
          {features.map(([title, body, icon]) => (
            <WebCard key={title} style={[styles.featureCard, compact ? styles.featureCardCompact : null]}>
              <View style={styles.featureIcon}><MaterialIcons name={icon} size={22} color={colors.primary} /></View>
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureBody}>{body}</Text>
            </WebCard>
          ))}
        </View>
      </WebSection>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Community Connect</Text>
        <Pressable onPress={() => router.push("/auth/login")}>
          <Text style={styles.footerLink}>Login</Text>
        </Pressable>
      </View>
    </WebShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 520,
    flexDirection: "row",
    alignItems: "center",
    gap: 36,
    paddingVertical: 54
  },
  heroCompact: {
    minHeight: 0,
    flexDirection: "column",
    alignItems: "stretch",
    paddingVertical: spacing.xl
  },
  heroCopy: {
    flex: 1,
    gap: spacing.lg
  },
  heroTitle: {
    fontSize: 56,
    lineHeight: 62,
    fontWeight: "800",
    color: colors.onSurface,
    fontFamily: typography.familyExtraBold
  },
  heroTitleCompact: {
    fontSize: 34,
    lineHeight: 40
  },
  heroSubtitle: {
    maxWidth: 650,
    fontSize: 18,
    lineHeight: 28,
    color: colors.textGrey,
    fontFamily: typography.family
  },
  heroActions: {
    flexDirection: "row",
    gap: spacing.md,
    flexWrap: "wrap"
  },
  preview: {
    width: "100%",
    maxWidth: 390,
    gap: spacing.md,
    backgroundColor: colors.primary
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  previewTitle: {
    ...typography.bodyLgStrong,
    color: colors.onPrimary,
    fontFamily: typography.familyBold
  },
  previewRow: {
    flexDirection: "row",
    gap: spacing.md,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.10)"
  },
  previewIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentGreen
  },
  previewRowTitle: {
    color: colors.onPrimary,
    fontWeight: "800"
  },
  previewRowBody: {
    marginTop: 3,
    color: "rgba(255,255,255,0.75)"
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingBottom: 60
  },
  featureCard: {
    width: "31%",
    minWidth: 280,
    gap: spacing.sm
  },
  featureCardCompact: {
    width: "100%",
    minWidth: 0
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceContainerLow
  },
  featureTitle: {
    ...typography.bodyLgStrong,
    color: colors.onSurface,
    fontFamily: typography.familyBold
  },
  featureBody: {
    ...typography.bodyMd,
    color: colors.textGrey,
    fontFamily: typography.family
  },
  footer: {
    minHeight: 82,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    backgroundColor: colors.surfaceContainerLowest
  },
  footerText: {
    color: colors.onSurface,
    fontWeight: "800"
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "800"
  }
});
