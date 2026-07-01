import { AccessRequest } from "@/types";

export function findApprovedRequest(requests: AccessRequest[], communityId?: string) {
  if (communityId) {
    return requests.find((request) => request.community.id === communityId && request.status === "APPROVED") ?? null;
  }

  return requests.find((request) => request.status === "APPROVED") ?? null;
}

export function findPendingRequest(requests: AccessRequest[], communityId?: string) {
  if (communityId) {
    return requests.find((request) => request.community.id === communityId && request.status === "PENDING") ?? null;
  }

  return requests.find((request) => request.status === "PENDING") ?? null;
}

