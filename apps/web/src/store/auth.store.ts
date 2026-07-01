export type Role = "SUPER_ADMIN" | "COMMUNITY_ADMIN" | "MEMBER";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: Role;
  profilePhotoUrl?: string | null;
};

export type AuthState = {
  token: string | null;
  user: AuthUser | null;
  role: Role | null;
  isAuthenticated: boolean;
};

const TOKEN_KEY = "communityConnect.token";
const USER_KEY = "communityConnect.user";
const ACTIVE_COMMUNITY_KEY = "communityConnect.activeCommunityId";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getAuthState(): AuthState {
  const token = getToken();
  const user = getUser();
  return { token, user, role: user?.role || null, isAuthenticated: Boolean(token && user) };
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth-changed"));
}

export function login(token: string, user: AuthUser) {
  saveAuth(token, user);
}

export function demoLogin(user: AuthUser) {
  saveAuth(`demo-token-${user.role.toLowerCase()}`, user);
  if (user.role === "MEMBER") {
    setActiveCommunityId("demo-community");
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACTIVE_COMMUNITY_KEY);
  window.dispatchEvent(new Event("auth-changed"));
}

export function logout() {
  clearAuth();
}

export function getActiveCommunityId() {
  return localStorage.getItem(ACTIVE_COMMUNITY_KEY);
}

export function setActiveCommunityId(communityId: string) {
  localStorage.setItem(ACTIVE_COMMUNITY_KEY, communityId);
  window.dispatchEvent(new Event("community-changed"));
}
