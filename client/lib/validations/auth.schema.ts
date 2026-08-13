// lib/validations/auth.schema.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zod v4 validation schema for the auth feature.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

export const loginSchema = z.object({
  emp_id: z
    .string()
    .min(1, "Employee ID is required.")
    .max(50, "Employee ID must be 50 characters or fewer.")
    .trim(),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
