// lib/validations/permission.schema.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zod validation for the RBAC Permission create/edit form.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

export const permissionSchema = z.object({
  resource: z.string().uuid("Please select a resource."),
  name: z
    .string()
    .min(1, "Permission name is required.")
    .max(100, "Permission name must be 100 characters or fewer.")
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
  is_active: z.boolean().default(true),
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;

export const blankPermissionValues: PermissionFormValues = {
  resource: "",
  name: "",
  code: "",
  description: "",
  is_active: true,
};