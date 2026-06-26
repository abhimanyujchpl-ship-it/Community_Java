import { create } from "zustand";
import { AuthUser } from "@/types";
import { authService, mapAuthUser } from "@/services/auth.service";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  bootstrapped: boolean;
  setUser: (user: AuthUser | null) => void;
  bootstrap: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  bootstrapped: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  bootstrap: async () => {
    const token = await authService.getToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, bootstrapped: true });
      return;
    }

    try {
      const user = await authService.me();
      set({ user: mapAuthUser(user), isAuthenticated: true, bootstrapped: true });
    } catch {
      await authService.clearToken();
      set({ user: null, isAuthenticated: false, bootstrapped: true });
    }
  },
  signOut: async () => {
    await authService.clearToken();
    set({ user: null, isAuthenticated: false, bootstrapped: true });
  }
}));
