"use client";

// features/permissions/components/PermissionFormFields.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Permission create/edit form fields — clean standard design:
//   1. Resource   — required searchable select (chosen first)
//   2. Name       — required; Code auto-generates from it (slug)
//   3. Description — optional textarea with live char counter
//   4. Active     — smooth toggle switch
// Receives the react-hook-form instance from FormModal.
// ─────────────────────────────────────────────────────────────────────────────

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { PermissionFormValues } from "@/lib/validations/permission.schema";
import type { Resource } from "@/features/resources/types";

/** Slugifies a permission name into a stable code: "View Patient Records" → "view-patient-records". */
const toCode = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const inputClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 disabled:cursor-not-allowed disabled:opacity-50";

interface PermissionFormFieldsProps {
  form: UseFormReturn<PermissionFormValues>;
  /** Active resources — options for the resource selector. */
  resources?: Resource[];
}

export function PermissionFormFields({ form, resources = [] }: PermissionFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const resourceOptions = resources
    .filter((r) => r.is_active)
    .sort((a, b) => a.name.localeCompare(b.name));

  const descriptionLength = useWatch({ control, name: "description" })?.length ?? 0;
  const isActive = useWatch({ control, name: "is_active" });

  return (
    <div className="flex flex-col gap-5">
      {/* ── 1. Resource — required searchable select ──────────────────── */}
      <Field>
        <FieldLabel htmlFor="permission-resource">
          Resource
          <span className="text-destructive" aria-hidden>
            *
          </span>
        </FieldLabel>
        <Controller
          control={control}
          name="resource"
          render={({ field }) => (
            <SearchableSelect
              id="permission-resource"
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              invalid={!!errors.resource}
              placeholder="Select a resource…"
              searchPlaceholder="Search resources…"
              emptyMessage="No matching resources"
              options={resourceOptions.map((r) => ({
                value: r.id,
                label: r.name,
                hint: r.code,
              }))}
            />
          )}
        />
        {errors.resource && (
          <p className="text-xs font-medium text-destructive">{errors.resource.message}</p>
        )}
      </Field>

      {/* ── 2. Name + Code — side by side; Code auto-slugs from Name ──── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="permission-name">
            Permission Name
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </FieldLabel>
          <Input
            id="permission-name"
            placeholder="e.g. View Patient Records"
            autoComplete="off"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "permission-name-error" : undefined}
            className={inputClass}
            {...register("name")}
            onChange={(event) => {
              const value = event.target.value;
              form.setValue("name", value);
              form.setValue("code", toCode(value));
            }}
          />
          {errors.name && (
            <p id="permission-name-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.name.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="permission-code">Code</FieldLabel>
          <Input
            id="permission-code"
            placeholder="Auto-generated from name"
            autoComplete="off"
            className={inputClass}
            {...register("code")}
          />
        </Field>
      </div>

      {/* ── 3. Description — textarea + live char counter ─────────────── */}
      <Field>
        <div className="flex w-full items-center justify-between">
          <FieldLabel htmlFor="permission-description">Description</FieldLabel>
          <span
            className={cn(
              "text-xs tabular-nums",
              errors.description ? "font-medium text-destructive" : "text-muted-foreground"
            )}
          >
            {descriptionLength}/500
          </span>
        </div>
        <textarea
          id="permission-description"
          rows={3}
          maxLength={500}
          placeholder="What does this permission allow?"
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "permission-description-error" : undefined}
          className={cn(inputClass, "min-h-24 resize-y py-2")}
          {...register("description")}
        />
        {errors.description && (
          <p id="permission-description-error" role="alert" className="text-xs font-medium text-destructive">
            {errors.description.message}
          </p>
        )}
      </Field>

      {/* ── 4. Active — smooth toggle switch ──────────────────────────── */}
      <Field>
        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <Switch
                id="permission-active"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Active status"
              />
            )}
          />
          <FieldLabel htmlFor="permission-active" className="mb-0 text-sm font-medium">
            {isActive ? (
              <span className="text-emerald-700 dark:text-emerald-400">Active</span>
            ) : (
              <span className="text-destructive">Inactive</span>
            )}
          </FieldLabel>
        </div>
      </Field>
    </div>
  );
}