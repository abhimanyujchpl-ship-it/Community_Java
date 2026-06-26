import { Redirect } from "expo-router";
import { LoadingState } from "@/components/common/LoadingState";
import { Screen } from "@/components/layout/Screen";
import { useAuthStore } from "@/store/auth.store";

export default function HomeScreen() {
  const { bootstrapped, isAuthenticated, user } = useAuthStore();

  if (!bootstrapped) {
    return (
      <Screen>
        <LoadingState message="Opening app" />
      </Screen>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href={user?.role === "MEMBER" ? "/tabs/community" : "/admin/access-requests"} />;
}
