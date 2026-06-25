import { Text, View } from "react-native";

type StatusTone = "success" | "warning" | "danger" | "neutral";

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
}

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-textGrey"
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <View className={`rounded-full px-2.5 py-1 ${toneClasses[tone]}`}>
      <Text className="text-xs font-semibold text-white">{label}</Text>
    </View>
  );
}
