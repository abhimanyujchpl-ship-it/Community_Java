import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { shadows } from "@/constants/shadows";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useAuthStore } from "@/store/auth.store";

const menuItems = [
  { title: "Edit profile", subtitle: "Update your details", icon: "person-outline", route: "/user/profile" },
  { title: "My posts", subtitle: "Track approvals and rejections", icon: "article", route: "/posts/my-posts" },
  { title: "Notifications", subtitle: "Unread alerts and approvals", icon: "notifications-none", route: "/notifications" }
] as const;

export default function ProfileTabScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const displayName = user?.fullName ?? "Community Member";

  const logout = async () => {
    await signOut();
    router.replace("/auth/login");
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.slice(0, 1).toUpperCase()}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
          <Text style={styles.meta} numberOfLines={1}>{user?.mobile || user?.email || "Signed out preview"}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{user?.role?.replace(/_/g, " ") ?? "MEMBER"}</Text>
          </View>
        </View>

        <View style={styles.list}>
          {menuItems.map((item) => (
            <Pressable key={item.title} style={styles.row} onPress={() => router.push(item.route)}>
              <View style={styles.rowIcon}>
                <MaterialIcons name={item.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textGrey} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.signOutButton} onPress={logout}>
          <MaterialIcons name="logout" size={20} color={colors.error} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  header: {
    minHeight: 72,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary
  },
  headerTitle: {
    ...typography.headlineMdMobile,
    color: colors.onPrimary,
    fontFamily: typography.familyBold
  },
  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 860,
    alignSelf: "center",
    gap: spacing.lg,
    padding: spacing.xl
  },
  card: {
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.xl,
    backgroundColor: colors.surfaceContainerLowest,
    ...shadows.card
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryContainer
  },
  avatarText: {
    color: colors.onPrimary,
    fontSize: 30,
    fontWeight: "800"
  },
  name: {
    ...typography.headlineSm,
    marginTop: spacing.md,
    color: colors.onSurface,
    fontFamily: typography.familyBold
  },
  meta: {
    marginTop: spacing.xs,
    color: colors.textGrey
  },
  badge: {
    marginTop: spacing.md,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceContainerLow
  },
  badgeText: {
    color: colors.primary,
    fontWeight: "800"
  },
  list: {
    overflow: "hidden",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    ...shadows.card
  },
  row: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceContainerLow
  },
  rowCopy: {
    flex: 1
  },
  rowTitle: {
    color: colors.onSurface,
    fontSize: 16,
    fontWeight: "800"
  },
  rowSubtitle: {
    marginTop: 3,
    color: colors.textGrey
  },
  signOutButton: {
    minHeight: 54,
    borderRadius: radius.default,
    borderWidth: 1,
    borderColor: colors.errorContainer,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest
  },
  signOutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: "800"
  }
});
