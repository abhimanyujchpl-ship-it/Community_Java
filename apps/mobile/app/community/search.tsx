import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PublicNavbar, WebBadge, WebButton, WebCard, WebInput, WebSection, WebShell } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const communities = [
  ["Green Valley Residents", "Pune, Maharashtra", "1,248 members", "Residential updates, events, and local support.", "Approved"],
  ["Lakeview Professionals", "Bengaluru, Karnataka", "842 members", "Networking, announcements, and skill meetups.", "Popular"],
  ["Sunrise Welfare Group", "Mumbai, Maharashtra", "534 members", "Community service, donations, and volunteer drives.", "Pending"]
];

export default function CommunitySearchScreen() {
  return (
    <WebShell>
      <PublicNavbar onNavigate={(path) => router.push(path as never)} />
      <WebSection>
        <View style={styles.header}>
          <Text style={styles.title}>Browse Communities</Text>
          <Text style={styles.subtitle}>Find verified community spaces and request access from admins.</Text>
        </View>
        <WebCard style={styles.searchCard}>
          <WebInput label="Search" placeholder="Search by name, city, or state" />
          <View style={styles.chips}>
            {["All", "Nearby", "Popular", "Pending", "Approved"].map((chip) => (
              <Pressable key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </Pressable>
            ))}
          </View>
        </WebCard>
        <View style={styles.grid}>
          {communities.map(([name, location, members, description, status]) => (
            <WebCard key={name} style={styles.card}>
              <View style={styles.avatar}>
                <MaterialIcons name="groups" size={26} color={colors.onPrimary} />
              </View>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{name}</Text>
                  <Text style={styles.meta}>{location}</Text>
                </View>
                <WebBadge label={status} tone={status === "Pending" ? "warning" : "success"} />
              </View>
              <Text style={styles.members}>{members}</Text>
              <Text style={styles.description}>{description}</Text>
              <WebButton label="Request Access" icon="login" onPress={() => router.push("/community/access-request")} />
            </WebCard>
          ))}
        </View>
      </WebSection>
    </WebShell>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    paddingTop: 42,
    paddingBottom: spacing.lg
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.onSurface,
    fontFamily: typography.familyExtraBold
  },
  subtitle: {
    fontSize: 17,
    color: colors.textGrey
  },
  searchCard: {
    gap: spacing.md
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  chip: {
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: colors.surfaceContainerLow
  },
  chipText: {
    color: colors.primary,
    fontWeight: "800"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingVertical: spacing.lg
  },
  card: {
    width: "31%",
    minWidth: 300,
    gap: spacing.md
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  cardHeader: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start"
  },
  cardTitle: {
    ...typography.bodyLgStrong,
    color: colors.onSurface,
    fontFamily: typography.familyBold
  },
  meta: {
    marginTop: 3,
    color: colors.textGrey
  },
  members: {
    color: colors.primary,
    fontWeight: "800"
  },
  description: {
    color: colors.textGrey,
    lineHeight: 21
  }
});
