import { create } from "zustand";
import { AuthUser } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  signOut: async () => {
    await authService.clearToken();
    set({ user: null, isAuthenticated: false });
  }
}));
