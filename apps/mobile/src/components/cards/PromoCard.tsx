import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export function PromoCard() {
  return (
    <View style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.title}>Build Connection</Text>
        <Text style={styles.subtitle}>High quality posts get 3x more engagement.</Text>
      </View>
      <View style={styles.glow} />
      <MaterialIcons name="groups" size={86} color="rgba(255,255,255,0.22)" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 128,
    overflow: "hidden",
    borderRadius: radius.xl,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.lg,
    justifyContent: "center"
  },
  copy: {
    width: "62%",
    zIndex: 1
  },
  title: {
    ...typography.headlineSm,
    color: colors.onPrimary,
    fontFamily: typography.family
  },
  subtitle: {
    ...typography.labelMd,
    marginTop: spacing.xs,
    color: "rgba(255,255,255,0.82)",
    fontFamily: typography.family
  },
  glow: {
    position: "absolute",
    width: 160,
    height: 160,
    right: -32,
    bottom: -52,
    borderRadius: 80,
    backgroundColor: "rgba(152,244,166,0.16)"
  },
  icon: {
    position: "absolute",
    right: 22,
    top: 23
  }
});

