import { create } from "zustand";

interface LeadViewState {
  isTableView: boolean;
  setIsTableView: (val: boolean) => void;
}

export const useLeadViewStore = create<LeadViewState>((set) => ({
  isTableView: false,

  setIsTableView: (val) => set(() => ({ isTableView: val })),
}));
