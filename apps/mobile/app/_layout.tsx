import "../src/global.css";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts
} from "@expo-google-fonts/inter";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LoadingState } from "@/components/common/LoadingState";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth.store";

export default function RootLayout() {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (!fontsLoaded) {
    return <LoadingState message="Opening app" />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface }
        }}
      />
    </>
  );
}
