// features/auth/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// Auth feature-specific types.
// ─────────────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  emp_id: string;
  password: string;
}

export interface AuthUser {
  id: number;
  emp_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  role: UserRole;
  full_name: string;
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

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: TokenPair;
}
