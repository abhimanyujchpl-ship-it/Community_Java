import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import { z } from "zod";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/common/AppHeader";
import { Screen } from "@/components/layout/Screen";
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
      router.replace(auth.user.role === "MEMBER" ? "/community/search" : "/admin/access-requests");
    } catch {
      Alert.alert("Login failed", "Check your email/mobile and password.");
    }
  };

  return (
    <>
      <AppHeader title="Sign in" showSearch={false} showNotifications={false} showMenu={false} />
      <Screen>
        <View className="gap-4 rounded-lg border border-border bg-white p-4">
          <Text className="text-xl font-bold text-textDark">Welcome back</Text>
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
          <PrimaryButton label="Continue" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
          <Pressable onPress={() => router.push("/auth/register")}>
            <Text className="text-center text-sm font-semibold text-primary">Create a new account</Text>
          </Pressable>
        </View>
      </Screen>
    </>
  );
}
