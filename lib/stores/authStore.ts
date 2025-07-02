import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        if (!email || !password) return false;

        const user = { email, name: email.split("@")[0] };
        set({ user, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
