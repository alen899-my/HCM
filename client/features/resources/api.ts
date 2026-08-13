// features/resources/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Resource API layer — thin typed wrapper on the shared apiClient.
// All methods return the HSM standard envelope (ApiResponse / PaginatedResponse).
// ─────────────────────────────────────────────────────────────────────────────

import apiClient from "@/lib/api-client";
import { RESOURCE_ENDPOINTS } from "@/lib/constants";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Resource, ResourceListParams, ResourcePayload } from "./types";

export const resourceApi = {
  list: async (params: ResourceListParams = {}): Promise<PaginatedResponse<Resource>> => {
    const response = await apiClient.get<PaginatedResponse<Resource>>(RESOURCE_ENDPOINTS.LIST, {
      params,
    });
    return response.data;
  },

  get: async (id: string): Promise<ApiResponse<Resource>> => {
    const response = await apiClient.get<ApiResponse<Resource>>(RESOURCE_ENDPOINTS.DETAIL(id));
    return response.data;
  },

  create: async (payload: ResourcePayload): Promise<ApiResponse<Resource>> => {
    const response = await apiClient.post<ApiResponse<Resource>>(
      RESOURCE_ENDPOINTS.CREATE,
      payload
    );
    return response.data;
  },

  update: async (id: string, payload: ResourcePayload): Promise<ApiResponse<Resource>> => {
    const response = await apiClient.patch<ApiResponse<Resource>>(
      RESOURCE_ENDPOINTS.DETAIL(id),
      payload
    );
    return response.data;
  },

  remove: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(RESOURCE_ENDPOINTS.DETAIL(id));
    return response.data;
  },
};
