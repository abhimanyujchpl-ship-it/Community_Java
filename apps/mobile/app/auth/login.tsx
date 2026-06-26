import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextField } from "@/components/forms/TextField";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { shadows } from "@/constants/shadows";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { authService, mapAuthUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const loginSchema = z.object({
  emailOrMobile: z.string().min(3, "Enter your email or mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrMobile: "", password: "" }
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      const auth = await authService.login(values);
      await authService.saveToken(auth.accessToken);
      setUser(mapAuthUser(auth.user));
      router.replace(auth.user.role === "MEMBER" ? "/tabs/feed" : "/admin/dashboard");
    } catch {
      Alert.alert("Login failed", "Backend is unreachable or the credentials are incorrect.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.root}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View style={styles.brandPanel}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="groups" size={34} color={colors.onPrimary} />
          </View>
          <Text style={styles.appName}>Community Connect</Text>
          <Text style={styles.subtitle}>Connect with your community</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign in</Text>
          <Text style={styles.cardSubtitle}>Use your email or mobile number to continue.</Text>

          <Controller
            control={control}
            name="emailOrMobile"
            render={({ field, fieldState }) => (
              <TextField
                label="Email or mobile"
                autoCapitalize="none"
                keyboardType="email-address"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <TextField
                label="Password"
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <PrimaryButton fullWidth label="Sign in" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />

          <View style={styles.actions}>
            <Pressable style={styles.secondaryAction} onPress={() => router.push("/auth/register")}>
              <MaterialIcons name="person-add-alt" size={18} color={colors.primary} />
              <Text style={styles.secondaryActionText}>Create account</Text>
            </Pressable>
            <Pressable style={styles.secondaryAction} onPress={() => router.push("/community/search")}>
              <MaterialIcons name="search" size={18} color={colors.primary} />
              <Text style={styles.secondaryActionText}>Browse communities</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xl
  },
  brandPanel: {
    minHeight: 260,
    paddingHorizontal: spacing.lg,
    paddingTop: 54,
    paddingBottom: spacing.xl,
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryContainer
  },
  appName: {
    ...typography.headlineMd,
    marginTop: spacing.lg,
    color: colors.onPrimary,
    fontFamily: typography.familyBold
  },
  subtitle: {
    ...typography.bodyLg,
    marginTop: spacing.xs,
    color: "rgba(255, 255, 255, 0.82)",
    fontFamily: typography.family
  },
  card: {
    gap: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: -36,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "rgba(191, 200, 197, 0.65)",
    backgroundColor: colors.surfaceContainerLowest,
    ...shadows.card
  },
  cardTitle: {
    ...typography.headlineSm,
    color: colors.onSurface,
    fontFamily: typography.familyBold
  },
  cardSubtitle: {
    ...typography.bodyMd,
    marginTop: -spacing.sm,
    color: colors.onSurfaceVariant,
    fontFamily: typography.family
  },
  actions: {
    gap: spacing.sm
  },
  secondaryAction: {
    minHeight: 46,
    borderRadius: radius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLow
  },
  secondaryActionText: {
    ...typography.bodyMd,
    color: colors.primary,
    fontFamily: typography.familySemiBold
  }
});
