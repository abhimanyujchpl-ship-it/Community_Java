export const colors = {
  primary: "#075E54",
  accent: "#25D366",
  background: "#FFFFFF",
  lightBackground: "#F0F2F5",
  textDark: "#111827",
  textGrey: "#6B7280",
  border: "#E5E7EB",
  danger: "#DC2626",
  warning: "#F59E0B",
  success: "#16A34A",
  notificationUnread: "#ECFDF5",
  white: "#FFFFFF"
} as const;

export type ThemeColor = keyof typeof colors;
