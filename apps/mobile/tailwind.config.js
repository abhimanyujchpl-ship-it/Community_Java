/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        surface: "#f1fcf8",
        surfaceDim: "#d2dcd9",
        surfaceBright: "#f1fcf8",
        surfaceContainerLowest: "#ffffff",
        surfaceContainerLow: "#ecf6f2",
        surfaceContainer: "#e6f0ec",
        surfaceContainerHigh: "#e0eae7",
        surfaceContainerHighest: "#dbe5e1",
        onSurface: "#141d1b",
        onSurfaceVariant: "#404946",
        inverseSurface: "#293230",
        inverseOnSurface: "#e9f3ef",
        outline: "#707976",
        outlineVariant: "#bfc8c5",
        surfaceTint: "#2f685f",
        primary: "#002d27",
        primaryContainer: "#00453d",
        secondary: "#016d2f",
        secondaryContainer: "#98f4a6",
        tertiary: "#1f2636",
        error: "#ba1a1a",
        accentGreen: "#25D366",
        accent: "#25D366",
        background: "#FFFFFF",
        lightBackground: "#F0F2F5",
        textDark: "#141d1b",
        textGrey: "#404946",
        border: "#bfc8c5",
        danger: "#ba1a1a",
        warning: "#F59E0B",
        success: "#016d2f",
        notificationUnread: "#ecf6f2",
        white: "#FFFFFF"
      }
    }
  },
  plugins: []
};
