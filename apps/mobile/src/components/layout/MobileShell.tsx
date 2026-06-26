import { PropsWithChildren } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";

export function MobileShell({ children }: PropsWithChildren) {
  return <View style={Platform.OS === "web" ? styles.webRoot : styles.native}>{children}</View>;
}

const styles = StyleSheet.create({
  native: {
    flex: 1,
    backgroundColor: colors.surface
  },
  webRoot: {
    flex: 1,
    width: "100%",
    minHeight: "100%",
    backgroundColor: colors.surface
  }
});
