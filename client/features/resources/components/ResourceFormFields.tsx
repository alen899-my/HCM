"use client";

// features/resources/components/ResourceFormFields.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Resource create/edit form fields — clean, standard design:
// label above field, consistent h-9 inputs, red inline Zod errors,
// Code auto-generates from Name (slug), Parent is a searchable select,
// Description has a live 500-char counter, Active is a smooth toggle.
// Receives the react-hook-form instance from FormModal.
// ─────────────────────────────────────────────────────────────────────────────

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { ResourceFormValues } from "@/lib/validations/resource.schema";
import type { Resource } from "../types";

/** Slugifies a resource name into a stable code: "Patient Management" → "patient-management". */
const toCode = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const inputClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 disabled:cursor-not-allowed disabled:opacity-50";

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
  const isActive = useWatch({ control, name: "is_active" });

  return (
    <div className="flex flex-col gap-5">
      {/* ── Name + Code — side by side on wider screens ───────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="resource-name">
            Resource Name
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </FieldLabel>
          <Input
            id="resource-name"
            placeholder="e.g. Patient Management"
            autoComplete="off"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "resource-name-error" : undefined}
            className={inputClass}
            {...register("name")}
            onChange={(event) => {
              const value = event.target.value;
              form.setValue("name", value);
              if (!form.getValues("code")) {
                form.setValue("code", toCode(value));
              }
            }}
          />
          {errors.name && (
            <p id="resource-name-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.name.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="resource-code">Code</FieldLabel>
          <Input
            id="resource-code"
            placeholder="Auto-generated from name"
            autoComplete="off"
            className={inputClass}
            {...register("code")}
          />
        </Field>
      </div>

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

      {/* ── Description — textarea + live char counter ───────────────── */}
      <Field>
        <div className="flex w-full items-center justify-between">
          <FieldLabel htmlFor="resource-description">Description</FieldLabel>
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
          id="resource-description"
          rows={3}
          maxLength={500}
          placeholder="What does this resource control?"
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "resource-description-error" : undefined}
          className={cn(
            inputClass,
            "min-h-24 resize-y py-2"
          )}
          {...register("description")}
        />
        {errors.description && (
          <p id="resource-description-error" role="alert" className="text-xs font-medium text-destructive">
            {errors.description.message}
          </p>
        )}
      </Field>

      {/* ── Active — smooth toggle switch ────────────────────────────── */}
      <Field>
        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <Switch
                id="resource-active"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Active status"
              />
            )}
          />
          <FieldLabel htmlFor="resource-active" className="mb-0 text-sm font-medium">
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