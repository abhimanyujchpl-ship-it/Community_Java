import { api, ApiResponse, unwrap } from "./api";
import { AuthUser } from "../store/auth.store";
import { findDemoUser } from "./demoData";

export type AuthResponse = {
  accessToken: string;
  token?: string;
  tokenType: "Bearer";
  expiresAt: string;
  user: AuthUser;
};

export type LoginPayload = {
  emailOrMobile: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
};

export const authService = {
  login: async (payload: LoginPayload) =>
    unwrap((await api.post<ApiResponse<AuthResponse>>("/auth/login", payload)).data),
  demoLogin: async (payload: LoginPayload): Promise<AuthResponse> => {
    const user = findDemoUser(payload.emailOrMobile, payload.password);
    if (!user) {
      throw new Error("Invalid demo credentials.");
    }
    const { password: _password, ...authUser } = user;
    return {
      accessToken: `demo-token-${authUser.role.toLowerCase()}`,
      token: `demo-token-${authUser.role.toLowerCase()}`,
      tokenType: "Bearer",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: authUser
    };
  },
  register: async (payload: RegisterPayload) =>
    unwrap((await api.post<ApiResponse<AuthResponse>>("/auth/register", payload)).data),
  me: async () => unwrap((await api.get<ApiResponse<AuthUser>>("/auth/me")).data)
};
