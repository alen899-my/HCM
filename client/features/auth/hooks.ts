// features/auth/hooks.ts
// ─────────────────────────────────────────────────────────────────────────────
// Custom hooks for the auth feature.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "./api";
import { useAuthStore } from "./store";
import type { LoginPayload } from "./types";

export function useLogin() {
  const router    = useRouter();
  const setAuth   = useAuthStore((s) => s.setAuth);
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(payload);
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.tokens);
        router.push("/dashboard");
      } else {
        setError(res.message || "Login failed.");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr?.response?.data?.message ?? "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

export function useLogout() {
  const router    = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const logout = async () => {
    const refreshToken = localStorage.getItem("hsm_refresh_token");
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Still clear local state even if server call fails
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  return { logout };
}
