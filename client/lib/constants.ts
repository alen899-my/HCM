// lib/constants.ts
// ─────────────────────────────────────────────────────────────────────────────
// Centralised constants — API base URL, route paths, etc.
// All API calls go through lib/api-client.ts, not this file directly.
// ─────────────────────────────────────────────────────────────────────────────

// ─── API ─────────────────────────────────────────────────────────────────────
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ─── Auth Endpoints ───────────────────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  LOGIN:          "/auth/login/",
  LOGOUT:         "/auth/logout/",
  REFRESH:        "/auth/refresh/",
  REGISTER:       "/auth/register/",
  ME:             "/auth/me/",
} as const;

// ─── Patient Endpoints ────────────────────────────────────────────────────────
export const PATIENT_ENDPOINTS = {
  LIST:    "/patients/",
  DETAIL:  (id: string) => `/patients/${id}/`,
  CREATE:  "/patients/",
} as const;

// ─── Doctor Endpoints ─────────────────────────────────────────────────────────
export const DOCTOR_ENDPOINTS = {
  LIST:   "/doctors/",
  DETAIL: (id: string) => `/doctors/${id}/`,
} as const;

// ─── Appointment Endpoints ────────────────────────────────────────────────────
export const APPOINTMENT_ENDPOINTS = {
  LIST:   "/appointments/",
  DETAIL: (id: string) => `/appointments/${id}/`,
} as const;

// ─── RBAC Resource Endpoints ──────────────────────────────────────────────────
export const RESOURCE_ENDPOINTS = {
  LIST:   "/resources/",
  DETAIL: (id: string) => `/resources/${id}/`,
  CREATE: "/resources/",
} as const;

// ─── Local Storage / Cookie Keys ─────────────────────────────────────────────
export const TOKEN_KEYS = {
  ACCESS:  "hsm_access_token",
  REFRESH: "hsm_refresh_token",
} as const;

// ─── App Routes ───────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME:         "/",
  LOGIN:        "/login",
  REGISTER:     "/register",
  DASHBOARD:    "/dashboard",
  PATIENTS:     "/patients",
  DOCTORS:      "/doctors",
  APPOINTMENTS: "/appointments",
  WARDS:        "/wards",
  PHARMACY:     "/pharmacy",
  LABORATORY:   "/laboratory",
  BILLING:      "/billing",
  REPORTS:      "/reports",
  RESOURCES:    "/resources",
  ROLES:        "/roles",
  PERMISSIONS:  "/permissions",
} as const;
