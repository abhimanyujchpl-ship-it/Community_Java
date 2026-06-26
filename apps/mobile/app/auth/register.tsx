import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
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
      Alert.alert("Registration failed", "Email or mobile may already be registered.");
    }
  };

  return (
    <>
      <AppHeader title="Create account" showSearch={false} showNotifications={false} showMenu={false} />
      <ScreenContainer>
        <View className="gap-4 rounded-lg border border-border bg-white p-4">
          <Text className="text-xl font-bold text-textDark">Join your community</Text>
          {(["fullName", "email", "mobile", "password", "city", "state", "occupation"] as const).map((name) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field, fieldState }) => (
                <TextField
                  label={{
                    fullName: "Full name",
                    email: "Email",
                    mobile: "Mobile",
                    password: "Password",
                    city: "City",
                    state: "State",
                    occupation: "Occupation"
                  }[name]}
                  autoCapitalize={name === "email" ? "none" : "sentences"}
                  keyboardType={name === "email" ? "email-address" : name === "mobile" ? "phone-pad" : "default"}
                  secureTextEntry={name === "password"}
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          ))}
          <PrimaryButton label="Create account" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
          <Pressable onPress={() => router.push("/auth/login")}>
            <Text className="text-center text-sm font-semibold text-primary">Already have an account?</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </>
  );
}
