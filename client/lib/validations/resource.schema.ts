// lib/validations/resource.schema.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zod validation for the RBAC Resource create/edit form.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

export const resourceSchema = z.object({
  name: z
    .string()
    .min(1, "Resource name is required.")
    .max(100, "Resource name must be 100 characters or fewer.")
    .trim(),
  code: z
    .string()
    .min(1, "Code is required.")
    .max(100, "Code must be 100 characters or fewer.")
    .trim()
    .regex(
      /^[a-zA-Z0-9-_ ]+$/,
      "Code may only contain letters, numbers, spaces, hyphens and underscores."
    ),
  description: z.string().max(500, "Description must be 500 characters or fewer.").optional(),
  parent: z.string().uuid("Invalid parent resource.").nullish(),
  is_active: z.boolean().default(true),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;

export const blankResourceValues: ResourceFormValues = {
  name: "",
  code: "",
  description: "",
  parent: null,
  is_active: true,
};
