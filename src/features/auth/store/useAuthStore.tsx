import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User interface after login/register
interface User {
  name: string;
  email: string;
  password: string;
}

// Login input type
interface LoginInput {
  email: string;
  password: string;
}

// Register input type
interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  login: (input: LoginInput) => void;
  register: (input: RegisterInput) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: ({ email, password }) => {
        // In real-world app, yahan backend call aayega.
        // Abhi dummy user create karke store kar rahe
        const fakeUser: User = {
          name: "Guest", // or fetch from server
          email,
          password,
        };
        set({ user: fakeUser });
      },

      register: ({ name, email, password }) => {
        const newUser: User = { name, email, password };
        set({ user: newUser });
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
