/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
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
      }
    }
  },
  plugins: []
};
