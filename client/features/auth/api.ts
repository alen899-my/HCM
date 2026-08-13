// features/auth/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// All API calls for the auth feature.
// Every call uses the shared Axios instance from lib/api-client.ts.
// ─────────────────────────────────────────────────────────────────────────────

import apiClient from "@/lib/api-client";
import type { LoginPayload, LoginResponse, AuthUser } from "./types";
import type { ApiResponse } from "@/types/api";

export const authApi = {
  /**
   * POST /api/v1/auth/login/
   * Accepts emp_id + password, returns user + JWT tokens.
   */
  login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login/",
      payload,
    );
    return response.data;
  },

  /**
   * POST /api/v1/auth/logout/
   * Blacklists the refresh token.
   */
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post("/auth/logout/", { refresh: refreshToken });
  },

  /**
   * GET /api/v1/auth/me/
   * Returns the current authenticated user.
   */
  getMe: async (): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.get<ApiResponse<AuthUser>>("/auth/me/");
    return response.data;
  },
};
