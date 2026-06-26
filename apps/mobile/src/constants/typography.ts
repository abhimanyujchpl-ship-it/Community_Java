export const typography = {
  family: "Inter_400Regular",
  familyMedium: "Inter_500Medium",
  familySemiBold: "Inter_600SemiBold",
  familyBold: "Inter_700Bold",
  familyExtraBold: "Inter_800ExtraBold",
  displayLg: { fontSize: 32, fontWeight: "700" as const, lineHeight: 40 },
  headlineMd: { fontSize: 24, fontWeight: "600" as const, lineHeight: 32 },
  headlineMdMobile: { fontSize: 22, fontWeight: "600" as const, lineHeight: 28 },
  headlineSm: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
  bodyLg: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  bodyLgStrong: { fontSize: 16, fontWeight: "600" as const, lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  labelMd: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16 },
  labelXs: { fontSize: 10, fontWeight: "700" as const, lineHeight: 12, letterSpacing: 0.5 }
} as const;
