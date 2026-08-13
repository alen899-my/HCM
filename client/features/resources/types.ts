// features/resources/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// TypeScript types for the RBAC Resource module.
// ─────────────────────────────────────────────────────────────────────────────

export interface Resource {
  id: string; // UUID
  name: string;
  code: string;
  description: string;
  parent: string | null;
  parent_code: string | null;
  is_active: boolean;
  children_count: number;
  created_at: string;
  updated_at: string;
}

export interface ResourcePayload {
  name: string;
  code: string;
  description?: string;
  parent?: string | null;
  is_active?: boolean;
}

export interface ResourceListParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean | "" | "true" | "false";
  parent?: string;
  ordering?: string;
}
