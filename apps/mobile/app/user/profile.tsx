import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { z } from "zod";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextField } from "@/components/forms/TextField";
import { AppHeader } from "@/components/common/AppHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { mapAuthUser } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  mobile: z.string().regex(/^[0-9]{8,15}$/, "Mobile must contain 8 to 15 digits"),
  city: z.string().optional(),
  state: z.string().optional(),
  occupation: z.string().optional(),
  profilePhotoUrl: z.string().optional()
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      mobile: user?.mobile ?? "",
      city: user?.city ?? "",
      state: user?.state ?? "",
      occupation: user?.occupation ?? "",
      profilePhotoUrl: user?.profilePhotoUrl ?? ""
    }
  });

  const onSubmit = async (values: ProfileForm) => {
    if (!user) {
      return;
    }

    try {
      const updated = await userService.update(user.id, {
        ...values,
        city: values.city || undefined,
        state: values.state || undefined,
        occupation: values.occupation || undefined,
        profilePhotoUrl: values.profilePhotoUrl || undefined
      });
      setUser(mapAuthUser(updated));
      Alert.alert("Profile updated", "Your profile changes were saved.");
    } catch {
      Alert.alert("Profile not updated", "Check your details and try again.");
    }
  };

  return (
    <>
      <AppHeader title="Edit Profile" showSearch={false} showNotifications={false} />
      <ScreenContainer>
        <View className="gap-4 rounded-lg border border-border bg-white p-4">
          {(["fullName", "email", "mobile", "city", "state", "occupation", "profilePhotoUrl"] as const).map((name) => (
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
                    city: "City",
                    state: "State",
                    occupation: "Occupation",
                    profilePhotoUrl: "Profile photo URL"
                  }[name]}
                  autoCapitalize={name === "email" || name === "profilePhotoUrl" ? "none" : "sentences"}
                  keyboardType={name === "email" ? "email-address" : name === "mobile" ? "phone-pad" : "default"}
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          ))}
          <PrimaryButton label="Save profile" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
        </View>
      </ScreenContainer>
    </>
  );
}
