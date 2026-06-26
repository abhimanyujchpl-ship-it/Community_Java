import { MaterialIcons } from "@expo/vector-icons";
import { PropsWithChildren, ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { shadows } from "@/constants/shadows";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export function WebShell({ children }: PropsWithChildren) {
  return <View style={web.root}>{children}</View>;
}

export function WebSection({ children }: PropsWithChildren) {
  return <View style={web.section}>{children}</View>;
}

export function WebCard({ children, style }: PropsWithChildren<{ style?: object }>) {
  return <View style={[web.card, style]}>{children}</View>;
}

export function WebButton({
  label,
  onPress,
  variant = "primary",
  icon
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <Pressable style={[web.button, web[`${variant}Button`]]} onPress={onPress}>
      {icon ? <MaterialIcons name={icon} size={18} color={variant === "primary" ? colors.onPrimary : colors.primary} /> : null}
      <Text style={[web.buttonText, variant === "primary" ? web.primaryButtonText : web.secondaryButtonText]}>{label}</Text>
    </Pressable>
  );
}

export function WebInput({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={web.field}>
      <Text style={web.fieldLabel}>{label}</Text>
      <TextInput style={[web.input, error ? web.inputError : null]} placeholderTextColor={colors.textGrey} {...props} />
      {error ? <Text style={web.errorText}>{error}</Text> : null}
    </View>
  );
}

export function WebTextarea({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return <WebInput label={label} error={error} multiline textAlignVertical="top" style={web.textarea} {...props} />;
}

export function WebSelect({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <View style={web.field}>
      <Text style={web.fieldLabel}>{label}</Text>
      <Pressable style={web.select} onPress={onPress}>
        <Text style={web.selectText}>{value}</Text>
        <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.onSurfaceVariant} />
      </Pressable>
    </View>
  );
}

export function WebBadge({ label, tone = "neutral" }: { label: string; tone?: "success" | "warning" | "danger" | "neutral" }) {
  return (
    <View style={[web.badge, tone === "success" ? web.badgeSuccess : tone === "warning" ? web.badgeWarning : tone === "danger" ? web.badgeDanger : null]}>
      <Text style={web.badgeText}>{label}</Text>
    </View>
  );
}

export function WebAvatar({ name }: { name: string }) {
  return (
    <View style={web.avatar}>
      <Text style={web.avatarText}>{name.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

export function PublicNavbar({ onNavigate }: { onNavigate: (path: string) => void }) {
  const links = [
    ["Features", "#features"],
    ["Communities", "/community/search"],
    ["Events", "/events"],
    ["Admin", "/admin/dashboard"],
    ["Login", "/auth/login"]
  ];

  return (
    <View style={web.nav}>
      <Pressable style={web.brand} onPress={() => onNavigate("/")}>
        <View style={web.brandMark}><MaterialIcons name="groups" size={22} color={colors.onPrimary} /></View>
        <Text style={web.brandText}>Community Connect</Text>
      </Pressable>
      <View style={web.navLinks}>
        {links.map(([label, path]) => (
          <Pressable key={label} onPress={() => onNavigate(path)}>
            <Text style={web.navLink}>{label}</Text>
          </Pressable>
        ))}
        <WebButton label="Get Started" onPress={() => onNavigate("/auth/register")} />
      </View>
    </View>
  );
}

export function DashboardLayout({ nav, title, children, right }: PropsWithChildren<{ nav: string[]; title: string; right?: ReactNode }>) {
  return (
    <WebShell>
      <View style={web.dashboard}>
        <View style={web.sidebar}>
          <View style={web.brand}>
            <View style={web.brandMark}><MaterialIcons name="groups" size={20} color={colors.onPrimary} /></View>
            <Text style={web.brandText}>Community Connect</Text>
          </View>
          {nav.map((item) => (
            <View key={item} style={web.sideItem}>
              <MaterialIcons name="chevron-right" size={18} color={colors.primary} />
              <Text style={web.sideText}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={web.main}>
          <View style={web.topbar}>
            <Text style={web.pageTitle}>{title}</Text>
            <View style={web.topbarRight}>
              <View style={web.searchBar}>
                <MaterialIcons name="search" size={18} color={colors.textGrey} />
                <Text style={web.searchText}>Search</Text>
              </View>
              <MaterialIcons name="notifications-none" size={24} color={colors.primary} />
              <WebAvatar name="Admin" />
            </View>
          </View>
          <View style={web.dashboardBody}>
            <View style={web.dashboardContent}>{children}</View>
            {right ? <View style={web.rightPanel}>{right}</View> : null}
          </View>
        </View>
      </View>
    </WebShell>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: string; icon: keyof typeof MaterialIcons.glyphMap }) {
  return (
    <WebCard style={web.statCard}>
      <View style={web.statIcon}><MaterialIcons name={icon} size={22} color={colors.primary} /></View>
      <Text style={web.statValue}>{value}</Text>
      <Text style={web.statLabel}>{label}</Text>
    </WebCard>
  );
}

export const web = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: colors.surface
  },
  section: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 28
  },
  nav: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  brandText: {
    ...typography.bodyLgStrong,
    color: colors.onSurface,
    fontFamily: typography.familyBold
  },
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22
  },
  navLink: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontFamily: typography.familyMedium
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    backgroundColor: colors.surfaceContainerLowest,
    ...shadows.card
  },
  button: {
    minHeight: 44,
    borderRadius: radius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18
  },
  primaryButton: {
    backgroundColor: colors.primary
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest
  },
  ghostButton: {
    backgroundColor: colors.surfaceContainerLow
  },
  dangerButton: {
    backgroundColor: colors.errorContainer
  },
  buttonText: {
    ...typography.bodyMd,
    fontFamily: typography.familyBold
  },
  primaryButtonText: {
    color: colors.onPrimary
  },
  secondaryButtonText: {
    color: colors.primary
  },
  field: {
    gap: 7
  },
  fieldLabel: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontFamily: typography.familyMedium
  },
  input: {
    minHeight: 50,
    borderRadius: radius.default,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.md,
    color: colors.onSurface,
    backgroundColor: colors.surfaceContainerLowest,
    fontSize: 15
  },
  textarea: {
    minHeight: 140,
    paddingTop: 14
  },
  inputError: {
    borderColor: colors.error
  },
  errorText: {
    color: colors.error,
    fontSize: 13
  },
  select: {
    minHeight: 50,
    borderRadius: radius.default,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainerLowest
  },
  selectText: {
    color: colors.onSurface,
    fontSize: 15
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: colors.surfaceContainerLow
  },
  badgeSuccess: {
    backgroundColor: "#dcfce7"
  },
  badgeWarning: {
    backgroundColor: "#fef3c7"
  },
  badgeDanger: {
    backgroundColor: colors.errorContainer
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800"
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryContainer
  },
  avatarText: {
    color: colors.onPrimary,
    fontWeight: "800"
  },
  dashboard: {
    flex: 1,
    flexDirection: "row"
  },
  sidebar: {
    width: 260,
    gap: 10,
    padding: 22,
    borderRightWidth: 1,
    borderRightColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest
  },
  sideItem: {
    minHeight: 44,
    borderRadius: radius.default,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceContainerLow
  },
  sideText: {
    color: colors.onSurface,
    fontWeight: "700"
  },
  main: {
    flex: 1
  },
  topbar: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest
  },
  pageTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    fontFamily: typography.familyBold
  },
  topbarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  searchBar: {
    width: 260,
    minHeight: 42,
    borderRadius: radius.full,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceContainerLow
  },
  searchText: {
    color: colors.textGrey
  },
  dashboardBody: {
    flex: 1,
    flexDirection: "row",
    gap: 22,
    padding: 28
  },
  dashboardContent: {
    flex: 1,
    gap: 18
  },
  rightPanel: {
    width: 320,
    gap: 16
  },
  statCard: {
    flex: 1,
    minWidth: 180
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceContainerLow
  },
  statValue: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: "800",
    color: colors.onSurface
  },
  statLabel: {
    color: colors.textGrey,
    marginTop: 4
  }
});
