export type UserRole = "USER" | "COMMUNITY_ADMIN" | "SUPER_ADMIN";

export interface Community {
  id: string;
  name: string;
  description?: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
