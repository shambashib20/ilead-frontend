import { create } from "zustand";

type SidebarState = {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  toggleMobile: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  mobileOpen: false,
  setMobileOpen: (value) => set({ mobileOpen: value }),
  toggleMobile: () =>
    set((state) => ({
      mobileOpen: !state.mobileOpen,
    })),
}));
