// features/auth/store.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zustand auth store — single source of truth for authentication state.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, TokenPair } from "./types";
import { setTokens, clearTokens } from "@/lib/api-client";

interface AuthState {
  user:        AuthUser | null;
  accessToken: string | null;
  isLoggedIn:  boolean;

  // Actions
  setAuth:   (user: AuthUser, tokens: TokenPair) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:        null,
      accessToken: null,
      isLoggedIn:  false,

      setAuth: (user, tokens) => {
        setTokens(tokens.access, tokens.refresh);
        set({ user, accessToken: tokens.access, isLoggedIn: true });
      },

      clearAuth: () => {
        clearTokens();
        set({ user: null, accessToken: null, isLoggedIn: false });
      },
    }),
    {
      name:    "hsm-auth",
      partialize: (state) => ({
        user:        state.user,
        accessToken: state.accessToken,
        isLoggedIn:  state.isLoggedIn,
      }),
    },
  ),
);
