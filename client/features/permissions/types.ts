// features/permissions/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// TypeScript types for the RBAC Permission module.
// ─────────────────────────────────────────────────────────────────────────────

export interface Permission {
  id: string; // UUID
  resource: string | null; // UUID
  resource_name: string;
  resource_code: string;
  name: string;
  code: string; // slug, unique
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PermissionPayload {
  resource: string;
  name: string;
  code: string;
  description?: string;
  is_active?: boolean;
}

export interface PermissionListParams {
  page?: number;
  page_size?: number;
  search?: string;
  resource?: string;
  is_active?: boolean | "" | "true" | "false";
  ordering?: string;
}