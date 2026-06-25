import { PostStatus, PostType } from "@/types";

export function postStatusTone(status: PostStatus): "success" | "warning" | "danger" | "neutral" {
  if (status === "APPROVED") {
    return "success";
  }
  if (status === "REJECTED" || status === "DELETED") {
    return "danger";
  }
  if (status === "PENDING_APPROVAL") {
    return "warning";
  }
  return "neutral";
}

export function postTypeLabel(type: PostType) {
  return type
    .split("_")
    .map((part) => part[0] + part.slice(1).toLowerCase())
    .join(" ");
}
