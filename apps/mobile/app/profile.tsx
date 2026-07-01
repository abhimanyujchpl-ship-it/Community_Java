import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DashboardLayout, WebAvatar, WebButton, WebCard, WebInput } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";

function apiError(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (!axiosError.response) {
    return "Backend not reachable. Please start server on port 8080.";
  }
  return axiosError.response.data?.message ?? fallback;
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    occupation: ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setForm({
      fullName: user?.fullName ?? user?.name ?? "",
      email: user?.email ?? "",
      mobile: user?.mobile ?? "",
      city: user?.city ?? "",
      state: user?.state ?? "",
      occupation: user?.occupation ?? ""
    });
  }, [user]);

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    if (!user) {
      setMessage({ tone: "error", text: "Sign in before updating your profile." });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const updated = await userService.update(user.id, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        city: form.city.trim() || undefined,
        state: form.state.trim() || undefined,
        occupation: form.occupation.trim() || undefined
      });
      setUser({
        ...user,
        name: updated.fullName,
        fullName: updated.fullName,
        email: updated.email,
        mobile: updated.mobile,
        phoneNumber: updated.mobile,
        city: updated.city,
        state: updated.state,
        occupation: updated.occupation
      });
      setMessage({ tone: "success", text: "Profile saved." });
    } catch (error) {
      setMessage({ tone: "error", text: apiError(error, "Unable to save profile.") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Profile" nav={["Dashboard", "Feed", "Communities", "Events", "Calendar", "Notifications", "Profile"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <WebCard style={styles.header}>
          <WebAvatar name={user?.name ?? "Member"} />
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>{user?.name ?? "Community Member"}</Text>
            <Text style={styles.muted}>{user?.email ?? "member@communityconnect.local"}</Text>
          </View>
          <WebButton label={saving ? "Saving..." : "Save Profile"} onPress={save} />
        </WebCard>
        <WebCard style={styles.form}>
          <Text style={styles.sectionTitle}>Member details</Text>
          <View style={styles.grid}>
            <View style={styles.field}><WebInput label="Full name" value={form.fullName} onChangeText={(value) => update("fullName", value)} /></View>
            <View style={styles.field}><WebInput label="Email" value={form.email} onChangeText={(value) => update("email", value)} /></View>
            <View style={styles.field}><WebInput label="Mobile" value={form.mobile} onChangeText={(value) => update("mobile", value)} /></View>
            <View style={styles.field}><WebInput label="City" value={form.city} onChangeText={(value) => update("city", value)} /></View>
            <View style={styles.field}><WebInput label="State" value={form.state} onChangeText={(value) => update("state", value)} /></View>
            <View style={styles.field}><WebInput label="Occupation" value={form.occupation} onChangeText={(value) => update("occupation", value)} /></View>
          </View>
          {message ? <Text style={[styles.message, message.tone === "success" ? styles.success : styles.error]}>{message.text}</Text> : null}
        </WebCard>
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, flexWrap: "wrap" },
  heading: { ...typography.headlineSm, color: colors.onSurface, fontFamily: typography.familyBold },
  muted: { color: colors.textGrey, lineHeight: 21 },
  form: { gap: spacing.lg },
  sectionTitle: { ...typography.bodyLgStrong, color: colors.onSurface, fontFamily: typography.familyBold },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  field: { flexBasis: "31%", flexGrow: 1, minWidth: 240 },
  message: { borderRadius: radius.default, padding: spacing.md, textAlign: "center", fontWeight: "700" },
  success: { color: colors.success, backgroundColor: "#dcfce7" },
  error: { color: colors.error, backgroundColor: colors.errorContainer }
});

