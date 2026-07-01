import "./ui.css";

export function Badge({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "success" | "warning" | "danger" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
