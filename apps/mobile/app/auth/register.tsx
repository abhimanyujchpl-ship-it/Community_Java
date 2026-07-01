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

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().regex(/^[0-9]{8,15}$/, "Mobile must contain 8 to 15 digits"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type RegisterForm = z.infer<typeof registerSchema>;

const fields = [
  { name: "fullName", label: "Full Name", placeholder: "Enter your full name" },
  { name: "email", label: "Email", placeholder: "you@example.com" },
  { name: "mobile", label: "Mobile", placeholder: "9876543210" },
  { name: "password", label: "Password", placeholder: "Create a secure password" }
] as const;

function getAuthError(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string }>;

  if (!axiosError.response) {
    return "Backend not reachable. Please start server on port 8080.";
  }

  return axiosError.response.data?.message ?? "Registration failed. Please check your details and try again.";
}

export default function RegisterScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 700;
  const setUser = useAuthStore((state) => state.setUser);
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", mobile: "", password: "" }
  });

  const onSubmit = async (values: RegisterForm) => {
    setStatus(null);

    try {
      const auth = await authService.register(values);
      await authService.saveToken(auth.accessToken);
      setUser(mapAuthUser(auth.user));
      setStatus({ tone: "success", message: "Account created successfully. Opening your dashboard..." });
      router.replace("/dashboard/member");
    } catch (error) {
      setStatus({ tone: "error", message: getAuthError(error) });
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
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join your community</Text>
          </View>

          <View style={styles.form}>
            {fields.map((fieldConfig) => (
              <Controller
                key={fieldConfig.name}
                control={control}
                name={fieldConfig.name}
                render={({ field, fieldState }) => (
                  <WebInput
                    label={fieldConfig.label}
                    placeholder={fieldConfig.placeholder}
                    autoCapitalize={fieldConfig.name === "email" ? "none" : "sentences"}
                    keyboardType={fieldConfig.name === "email" ? "email-address" : fieldConfig.name === "mobile" ? "phone-pad" : "default"}
                    secureTextEntry={fieldConfig.name === "password"}
                    value={field.value}
                    onChangeText={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            ))}
          </View>

          {status ? <Text style={[styles.message, status.tone === "success" ? styles.success : styles.error]}>{status.message}</Text> : null}

          <WebButton label={isSubmitting ? "Creating account..." : "Create Account"} onPress={handleSubmit(onSubmit)} />

          <Pressable style={styles.linkRow} onPress={() => router.push("/auth/login")}>
            <Text style={styles.muted}>Already have an account?</Text>
            <Text style={styles.link}>Sign in</Text>
          </Pressable>
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
    fontFamily: typography.family
  },
  form: {
    gap: spacing.md
  },
  message: {
    borderRadius: radius.default,
    padding: spacing.md,
    textAlign: "center",
    fontFamily: typography.familyMedium
  },
  success: {
    color: colors.success,
    backgroundColor: "#dcfce7"
  },
  error: {
    color: colors.error,
    backgroundColor: colors.errorContainer
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    flexWrap: "wrap"
  },
  muted: {
    color: colors.textGrey
  },
  link: {
    color: colors.primary,
    fontWeight: "800"
  }
});
