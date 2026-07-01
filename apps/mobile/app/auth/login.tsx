import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { z } from "zod";
import { WebButton, WebCard, WebInput, WebShell } from "@/components/web/WebKit";
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

function getAuthError(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string }>;

  if (!axiosError.response) {
    return "Backend not reachable. Please start server on port 8080.";
  }

  return axiosError.response.data?.message ?? "Login failed. Check your credentials and try again.";
}

function getRedirectForRole(role: string) {
  return role === "MEMBER" ? "/dashboard/member" : "/admin/dashboard";
}

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 700;
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrMobile: "", password: "" }
  });

  const onSubmit = async (values: LoginForm) => {
    setError(null);

    try {
      const auth = await authService.login(values);
      await authService.saveToken(auth.accessToken);
      setUser(mapAuthUser(auth.user));
      router.replace(getRedirectForRole(auth.user.role) as never);
    } catch (requestError) {
      setError(getAuthError(requestError));
    }
  };

  return (
    <WebShell>
      <ScrollView contentContainerStyle={[styles.page, compact ? styles.pageCompact : null]} keyboardShouldPersistTaps="handled">
        <WebCard style={[styles.card, compact ? styles.cardCompact : null]}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <MaterialIcons name="groups" size={28} color={colors.onPrimary} />
            </View>
            <Text style={styles.appName}>Community Connect</Text>
          </View>

          <View style={styles.headingBlock}>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.subtitle}>Use your email or mobile number to continue.</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="emailOrMobile"
              render={({ field, fieldState }) => (
                <WebInput
                  label="Email or mobile"
                  placeholder="admin@communityconnect.local"
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
                <WebInput
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <WebButton label={isSubmitting ? "Signing in..." : "Sign in"} onPress={handleSubmit(onSubmit)} />

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

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Demo credentials</Text>
            <Text style={styles.demoText}>Admin: admin@communityconnect.local / Pass@123</Text>
            <Text style={styles.demoText}>Member: member@communityconnect.local / Pass@123</Text>
          </View>
        </WebCard>
      </ScrollView>
    </WebShell>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: colors.surface
  },
  pageCompact: {
    justifyContent: "flex-start",
    padding: spacing.md
  },
  card: {
    width: "100%",
    maxWidth: 520,
    gap: spacing.lg,
    borderRadius: radius.xl,
    padding: 30,
    ...shadows.card
  },
  cardCompact: {
    padding: spacing.lg
  },
  brand: {
    alignItems: "center",
    gap: spacing.sm
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  appName: {
    ...typography.bodyLgStrong,
    color: colors.onSurface,
    fontFamily: typography.familyBold
  },
  headingBlock: {
    alignItems: "center",
    gap: spacing.xs
  },
  title: {
    ...typography.headlineMd,
    color: colors.onSurface,
    fontFamily: typography.familyBold
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.textGrey,
    fontFamily: typography.family,
    textAlign: "center"
  },
  form: {
    gap: spacing.md
  },
  error: {
    borderRadius: radius.default,
    padding: spacing.md,
    color: colors.error,
    textAlign: "center",
    backgroundColor: colors.errorContainer,
    fontFamily: typography.familyMedium
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap"
  },
  secondaryAction: {
    flex: 1,
    minWidth: 190,
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
  },
  demoBox: {
    gap: spacing.xs,
    borderRadius: radius.default,
    padding: spacing.md,
    backgroundColor: colors.surfaceContainerLow
  },
  demoTitle: {
    color: colors.onSurface,
    fontWeight: "800"
  },
  demoText: {
    color: colors.textGrey
  }
});
