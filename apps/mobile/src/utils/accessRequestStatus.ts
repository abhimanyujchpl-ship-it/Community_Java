import { AccessRequestStatus } from "@/types";

export function accessRequestTone(status: AccessRequestStatus): "success" | "warning" | "danger" {
  if (status === "APPROVED") {
    return "success";
  }
  if (status === "REJECTED" || status === "BLOCKED" || status === "REMOVED") {
    return "danger";
  }
  return "warning";
}
