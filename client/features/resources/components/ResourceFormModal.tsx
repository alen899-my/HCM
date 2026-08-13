"use client";

// features/resources/components/ResourceFormModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Create / Edit modal for Resources — one component, two modes.
// ─────────────────────────────────────────────────────────────────────────────

import { FormModal } from "@/components/common/FormModal";
import { resourceSchema, blankResourceValues, type ResourceFormValues } from "@/lib/validations/resource.schema";
import type { Resource } from "../types";
import { ResourceFormFields } from "./ResourceFormFields";

interface ResourceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The resource being edited, or null when creating. */
  resource: Resource | null;
  /** All resources (for the parent selector). */
  resources: Resource[];
  onSubmit: (values: ResourceFormValues) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function ResourceFormModal({
  open,
  onOpenChange,
  resource,
  resources,
  onSubmit,
  loading = false,
  error = null,
}: ResourceFormModalProps) {
  const defaultValues: ResourceFormValues = resource
    ? {
        name: resource.name,
        code: resource.code,
        description: resource.description ?? "",
        parent: resource.parent,
        is_active: resource.is_active,
      }
    : blankResourceValues;

  return (
    <FormModal<ResourceFormValues>
      open={open}
      onOpenChange={onOpenChange}
      title={resource ? "Edit Resource" : "Add New Resource"}
      description={
        resource
          ? "Update the details of this system resource."
          : "Create a new system resource to manage in RBAC."
      }
      schema={resourceSchema}
      defaultValues={defaultValues}
      submitLabel={resource ? "Save Changes" : "Create Resource"}
      loading={loading}
      error={error}
      onSubmit={onSubmit}
    >
      {(form) => (
        <ResourceFormFields form={form} resources={resources} editingResource={resource} />
      )}
    </FormModal>
  );
}