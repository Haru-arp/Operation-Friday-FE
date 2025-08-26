import { create } from "zustand";

export interface User {
  email: string;
  name: string;
  userRole: string;
  darkMode: boolean;
}

export interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
