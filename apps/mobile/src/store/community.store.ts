import { create } from "zustand";
import { CommunitySummary } from "@/types";

interface CommunityState {
  activeCommunity: CommunitySummary | null;
  setActiveCommunity: (community: CommunitySummary | null) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  activeCommunity: null,
  setActiveCommunity: (community) => set({ activeCommunity: community })
}));
