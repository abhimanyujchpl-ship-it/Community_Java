import { Platform } from "react-native";

export const shadows = {
  card: Platform.select({
    web: { boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)" },
    default: {
      shadowColor: "#000000",
      shadowOpacity: 0.04,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1
    }
  }),
  button: Platform.select({
    web: { boxShadow: "0 8px 16px rgba(0, 45, 39, 0.20)" },
    default: {
      shadowColor: "#002d27",
      shadowOpacity: 0.2,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4
    }
  })
} as const;
