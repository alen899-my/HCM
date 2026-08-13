"use client";

// features/permissions/components/PermissionFormModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Create / Edit modal for Permissions — one component, two modes.
// ─────────────────────────────────────────────────────────────────────────────

import { FormModal } from "@/components/common/FormModal";
import {
  permissionSchema,
  blankPermissionValues,
  type PermissionFormValues,
} from "@/lib/validations/permission.schema";
import { type Permission } from "../types";
import { PermissionFormFields } from "./PermissionFormFields";
import type { Resource } from "@/features/resources/types";

interface PermissionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The permission being edited, or null when creating. */
  permission: Permission | null;
  /** Active resources — options for the resource selector. */
  resources: Resource[];
  onSubmit: (values: PermissionFormValues) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  /**
   * Bumped after each successful create to reset the form while staying open
   * ("add another for the same resource" flow).
   */
  resetKey?: number;
  /** Resource pre-selected for create mode — preserved across resets. */
  defaultResource?: string;
}

export function PermissionFormModal({
  open,
  onOpenChange,
  permission,
  resources,
  onSubmit,
  loading = false,
  error = null,
  resetKey,
  defaultResource = "",
}: PermissionFormModalProps) {
  const defaultValues: PermissionFormValues = permission
    ? {
        resource: permission.resource ?? "",
        name: permission.name,
        code: permission.code,
        description: permission.description ?? "",
        is_active: permission.is_active,
      }
    : { ...blankPermissionValues, resource: defaultResource };

  return (
    <FormModal<PermissionFormValues>
      open={open}
      onOpenChange={onOpenChange}
      title={permission ? "Edit Permission" : "Add New Permission"}
      description={
        permission
          ? `Update "${permission.name}" on ${permission.resource_name}.`
          : "Create a named permission scoped to a system resource."
      }
      schema={permissionSchema}
      defaultValues={defaultValues}
      submitLabel={permission ? "Save Changes" : "Create Permission"}
      submitExtra={permission ? undefined : { label: "Add More" }}
      loading={loading}
      error={error}
      resetKey={resetKey}
      onSubmit={onSubmit}
    >
      {(form) => <PermissionFormFields form={form} resources={resources} />}
    </FormModal>
  );
}