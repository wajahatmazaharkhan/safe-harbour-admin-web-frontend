import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      authenticated: false,
      toggleAuthState: (value) => set({ authenticated: value }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
