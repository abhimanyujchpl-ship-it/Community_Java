import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/headers/AppHeader";
import { Screen } from "@/components/layout/Screen";

const loginSchema = z.object({
  phoneNumber: z.string().min(8, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phoneNumber: "", password: "" }
  });

  const onSubmit = (values: LoginForm) => {
    console.log("Login placeholder", values.phoneNumber);
  };

  return (
    <>
      <AppHeader title="Sign in" showSearch={false} showNotifications={false} showMenu={false} />
      <Screen>
        <View className="gap-4 rounded-xl border border-border bg-white p-4">
          <Text className="text-xl font-bold text-textDark">Welcome back</Text>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <TextField
                label="Phone number"
                keyboardType="phone-pad"
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
          <PrimaryButton label="Continue" onPress={handleSubmit(onSubmit)} />
        </View>
      </Screen>
    </>
  );
}
