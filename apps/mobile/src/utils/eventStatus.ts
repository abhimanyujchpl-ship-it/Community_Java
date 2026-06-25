import { EventStatus } from "@/types";

export function eventStatusTone(status: EventStatus): "success" | "warning" | "danger" | "neutral" {
  if (status === "COMPLETED") {
    return "success";
  }
  if (status === "CANCELLED") {
    return "danger";
  }
  return "warning";
}
