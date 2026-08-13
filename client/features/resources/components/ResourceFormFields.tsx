"use client";

// features/resources/components/ResourceFormFields.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Form fields used by BOTH the create and edit Resource modals.
// Floating-label inputs (placeholder → label animation) with Zod validation.
// Receives the react-hook-form instance from FormModal.
// ─────────────────────────────────────────────────────────────────────────────

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";

/** Slugifies a resource name into a stable code: "Patient Management" → "patient-management". */
const toCode = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
import { FloatingInput, FloatingTextarea } from "@/components/common/FloatingInput";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ResourceFormValues } from "@/lib/validations/resource.schema";
import type { Resource } from "../types";

interface ResourceFormFieldsProps {
  form: UseFormReturn<ResourceFormValues>;
  /** All active resources — used to build the parent (sub-module of) selector. */
  resources?: Resource[];
  /** The resource currently being edited (excluded from its own parent list). */
  editingResource?: Resource | null;
}

export function ResourceFormFields({
  form,
  resources = [],
  editingResource,
}: ResourceFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const parentOptions = resources
    .filter((r) => r.is_active && r.id !== editingResource?.id)
    .sort((a, b) => a.name.localeCompare(b.name));

  const descriptionLength = useWatch({ control, name: "description" })?.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Name — floating label + Zod error ─────────────────────────── */}
      <FloatingInput
        id="resource-name"
        label="Resource Name"
        required
        error={errors.name?.message}
        {...register("name")}
        onChange={(event) => {
          const value = event.target.value;
          form.setValue("name", value);
          if (!form.getValues("code")) {
            form.setValue("code", toCode(value));
          }
        }}
      />

      {/* ── Code — auto-generated from Name (slug), no error text ──────── */}
      <FloatingInput
        id="resource-code"
        label="Code"
        {...register("code")}
      />

      {/* ── Parent — searchable select ───────────────────────────────── */}
      <Field>
        <FieldLabel htmlFor="resource-parent">Parent Resource</FieldLabel>
        <Controller
          control={control}
          name="parent"
          render={({ field }) => (
            <SearchableSelect
              id="resource-parent"
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              invalid={!!errors.parent}
              placeholder="None (top-level module)"
              searchPlaceholder="Search resources…"
              emptyMessage="No matching resources"
              options={[
                { value: "", label: "None (top-level module)" },
                ...parentOptions.map((r) => ({
                  value: r.id,
                  label: r.name,
                  hint: r.parent_code || undefined,
                })),
              ]}
            />
          )}
        />
        {errors.parent && <p className="text-xs font-medium text-destructive">{errors.parent.message}</p>}
      </Field>

      {/* ── Description — floating label textarea + live char counter ── */}
      <div className="flex flex-col gap-1">
        <FloatingTextarea
          id="resource-description"
          label="Description"
          rows={3}
          maxLength={500}
          error={errors.description?.message}
          {...register("description")}
        />
        <p
          className={cn(
            "text-right text-xs tabular-nums",
            errors.description ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {descriptionLength}/500
        </p>
      </div>

      {/* ── Active ────────────────────────────────────────────────────── */}
      <Field>
        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <Checkbox
                id="resource-active"
                className="size-5 rounded-[6px]"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FieldLabel htmlFor="resource-active" className="mb-0 text-sm font-medium">
            Active
          </FieldLabel>
        </div>
        <FieldDescription>
          Inactive resources are hidden from permission assignment screens.
        </FieldDescription>
      </Field>
    </div>
  );
}
