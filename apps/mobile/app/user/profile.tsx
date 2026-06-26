import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { shadows } from "@/constants/shadows";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { mapAuthUser } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";

type EditableProfile = {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  occupation: string;
  profilePhotoUrl: string;
};

const fallbackProfile: EditableProfile = {
  fullName: "Community Member",
  email: "member@example.com",
  mobile: "",
  city: "",
  state: "",
  occupation: "",
  profilePhotoUrl: ""
};

const fields: Array<{ key: keyof EditableProfile; label: string; keyboardType?: "default" | "email-address" | "phone-pad" }> = [
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email", keyboardType: "email-address" },
  { key: "mobile", label: "Mobile", keyboardType: "phone-pad" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "occupation", label: "Occupation" },
  { key: "profilePhotoUrl", label: "Profile photo URL" }
];

export default function UserProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const initialProfile = useMemo<EditableProfile>(
    () => ({
      fullName: user?.fullName ?? fallbackProfile.fullName,
      email: user?.email ?? fallbackProfile.email,
      mobile: user?.mobile ?? fallbackProfile.mobile,
      city: user?.city ?? fallbackProfile.city,
      state: user?.state ?? fallbackProfile.state,
      occupation: user?.occupation ?? fallbackProfile.occupation,
      profilePhotoUrl: user?.profilePhotoUrl ?? fallbackProfile.profilePhotoUrl
    }),
    [user]
  );
  const [profile, setProfile] = useState<EditableProfile>(initialProfile);
  const [saving, setSaving] = useState(false);

  const updateField = (key: keyof EditableProfile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const saveProfile = async () => {
    if (!profile.fullName.trim() || !profile.email.trim() || !profile.mobile.trim()) {
      Alert.alert("Missing details", "Full name, email, and mobile are required.");
      return;
    }

    if (!user?.id) {
      Alert.alert("Demo profile", "Sign in to save profile changes to the backend.");
      return;
    }

    try {
      setSaving(true);
      const updated = await userService.update(user.id, {
        fullName: profile.fullName.trim(),
        email: profile.email.trim(),
        mobile: profile.mobile.trim(),
        city: profile.city.trim() || undefined,
        state: profile.state.trim() || undefined,
        occupation: profile.occupation.trim() || undefined,
        profilePhotoUrl: profile.profilePhotoUrl.trim() || undefined
      });
      setUser(mapAuthUser(updated));
      Alert.alert("Profile updated", "Your profile changes were saved.");
    } catch {
      Alert.alert("Profile not updated", "The backend could not save your profile right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.fullName.slice(0, 1).toUpperCase()}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>{profile.fullName}</Text>
          <Text style={styles.meta} numberOfLines={1}>{user?.role?.replace(/_/g, " ") ?? "MEMBER"}</Text>
        </View>

        <View style={styles.formCard}>
          {fields.map((field) => (
            <View key={field.key} style={styles.field}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                value={profile[field.key]}
                onChangeText={(value) => updateField(field.key, value)}
                placeholder={field.label}
                placeholderTextColor={colors.textGrey}
                keyboardType={field.keyboardType ?? "default"}
                autoCapitalize={field.key === "email" || field.key === "profilePhotoUrl" ? "none" : "sentences"}
                style={styles.input}
              />
            </View>
          ))}

          <Pressable style={[styles.saveButton, saving ? styles.disabled : null]} onPress={saveProfile} disabled={saving}>
            <MaterialIcons name="save" size={20} color={colors.onPrimary} />
            <Text style={styles.saveText}>{saving ? "Saving..." : "Save profile"}</Text>
          </Pressable>
        </View>
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
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  headerTitle: {
    ...typography.headlineSm,
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
  profileCard: {
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
    color: colors.textGrey,
    fontWeight: "700"
  },
  formCard: {
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.xl,
    backgroundColor: colors.surfaceContainerLowest,
    ...shadows.card
  },
  field: {
    gap: spacing.xs
  },
  label: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontFamily: typography.familyMedium
  },
  input: {
    minHeight: 52,
    borderRadius: radius.default,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.md,
    color: colors.onSurface,
    backgroundColor: colors.surfaceContainerLowest,
    fontSize: 16
  },
  saveButton: {
    minHeight: 54,
    marginTop: spacing.sm,
    borderRadius: radius.default,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary
  },
  saveText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "800"
  },
  disabled: {
    opacity: 0.65
  }
});
