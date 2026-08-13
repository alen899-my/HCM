// features/permissions/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Permission API layer — thin typed wrapper on the shared apiClient.
// All methods return the HSM standard envelope (ApiResponse / PaginatedResponse).
// ─────────────────────────────────────────────────────────────────────────────

import apiClient from "@/lib/api-client";
import { PERMISSION_ENDPOINTS } from "@/lib/constants";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Permission, PermissionListParams, PermissionPayload } from "./types";

export const permissionApi = {
  list: async (params: PermissionListParams = {}): Promise<PaginatedResponse<Permission>> => {
    const response = await apiClient.get<PaginatedResponse<Permission>>(
      PERMISSION_ENDPOINTS.LIST,
      { params }
    );
    return response.data;
  },

  get: async (id: string): Promise<ApiResponse<Permission>> => {
    const response = await apiClient.get<ApiResponse<Permission>>(PERMISSION_ENDPOINTS.DETAIL(id));
    return response.data;
  },

  create: async (payload: PermissionPayload): Promise<ApiResponse<Permission>> => {
    const response = await apiClient.post<ApiResponse<Permission>>(
      PERMISSION_ENDPOINTS.CREATE,
      payload
    );
    return response.data;
  },

  update: async (id: string, payload: PermissionPayload): Promise<ApiResponse<Permission>> => {
    const response = await apiClient.patch<ApiResponse<Permission>>(
      PERMISSION_ENDPOINTS.DETAIL(id),
      payload
    );
    return response.data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(PERMISSION_ENDPOINTS.DETAIL(id));
    return response.data;
  },
};