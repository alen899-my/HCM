// types/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Global TypeScript types that mirror the HSM standard API response envelope.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Standard Response Envelope ───────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  errors: Record<string, string[]> | null;
  meta: PaginationMeta | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// ─── Auth Types ────────────────────────────────────────────────────────────────

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export type UserRole =
  | "superadmin"
  | "admin"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "patient"
  | "pharmacist"
  | "lab_technician";

// ─── Common Field Types ────────────────────────────────────────────────────────

export interface TimestampedEntity {
  created_at: string; // ISO-8601 UTC
  updated_at: string;
}

export type UUID = string;

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ListQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

// ─── Error ────────────────────────────────────────────────────────────────────

export interface ApiError {
  success: false;
  data: null;
  message: string;
  errors: Record<string, string[]> | null;
  meta: null;
}
