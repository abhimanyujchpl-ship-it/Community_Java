import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { WebButton, WebCard, WebInput, WebShell } from "@/components/web/WebKit";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { authService, mapAuthUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().regex(/^[0-9]{8,15}$/, "Mobile must contain 8 to 15 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  city: z.string().optional(),
  state: z.string().optional(),
  occupation: z.string().optional()
});

type RegisterForm = z.infer<typeof registerSchema>;

const labels: Record<keyof RegisterForm, string> = {
  fullName: "Full name",
  email: "Email",
  mobile: "Mobile",
  password: "Password",
  city: "City",
  state: "State",
  occupation: "Occupation"
};

export default function RegisterScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", mobile: "", password: "", city: "", state: "", occupation: "" }
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      const auth = await authService.register({
        ...values,
        city: values.city || undefined,
        state: values.state || undefined,
        occupation: values.occupation || undefined
      });
      await authService.saveToken(auth.accessToken);
      setUser(mapAuthUser(auth.user));
      router.replace("/community/search");
    } catch {
      Alert.alert("Registration failed", "Backend is unreachable or this email/mobile already exists.");
    }
  };

  return (
    <WebShell>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <WebCard style={styles.card}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join your community</Text>
          <View style={styles.grid}>
            {(["fullName", "email", "mobile", "password", "city", "state", "occupation"] as const).map((name) => (
              <View key={name} style={name === "occupation" ? styles.full : styles.half}>
                <Controller
                  control={control}
                  name={name}
                  render={({ field, fieldState }) => (
                    <WebInput
                      label={labels[name]}
                      placeholder={labels[name]}
                      autoCapitalize={name === "email" ? "none" : "sentences"}
                      keyboardType={name === "email" ? "email-address" : name === "mobile" ? "phone-pad" : "default"}
                      secureTextEntry={name === "password"}
                      value={field.value}
                      onChangeText={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </View>
            ))}
          </View>
          <WebButton label={isSubmitting ? "Creating account..." : "Create account"} onPress={handleSubmit(onSubmit)} />
          <Pressable onPress={() => router.push("/auth/login")}>
            <Text style={styles.link}>Already have an account? Sign in</Text>
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
  card: {
    width: "100%",
    maxWidth: 760,
    gap: spacing.lg
  },
  title: {
    ...typography.headlineMd,
    color: colors.onSurface,
    fontFamily: typography.familyBold
  },
  subtitle: {
    ...typography.bodyLg,
    marginTop: -spacing.md,
    color: colors.textGrey,
    fontFamily: typography.family
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md
  },
  half: {
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 260
  },
  full: {
    width: "100%"
  },
  link: {
    textAlign: "center",
    color: colors.primary,
    fontWeight: "800"
  }
});
