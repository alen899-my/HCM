"use client";

// components/common/FormModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Common Create/Edit modal: Modal + react-hook-form + Zod resolver.
//
// One component serves BOTH create and edit — pass different `defaultValues`
// and `title`. Field markup is provided by the `children` render prop, which
// receives the form instance (register / control / formState).
//
// Usage:
//   <FormModal
//     open={open}
//     onOpenChange={setOpen}
//     title={editing ? "Edit Resource" : "Add Resource"}
//     schema={resourceSchema}
//     defaultValues={editing ?? blankValues}
//     loading={mutating}
//     onSubmit={handleSave}
//   >
//     {(form) => <ResourceFormFields form={form} />}
//   </FormModal>
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/common/Modal";

export interface FormModalProps<T extends FieldValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  schema: z.ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (values: T) => Promise<void> | void;
  submitLabel?: string;
  loading?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  /** Generic server-side error banner (e.g. failed request). */
  error?: string | null;
  children: (form: UseFormReturn<T>) => React.ReactNode;
}

export function FormModal<T extends FieldValues>({
  open,
  onOpenChange,
  title,
  description,
  schema,
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  loading = false,
  size = "md",
  error,
  children,
}: FormModalProps<T>) {
  const defaultsRef = useRef(defaultValues);

  useEffect(() => {
    defaultsRef.current = defaultValues;
  }, [defaultValues]);

  const form = useForm<T>({
    // Zod v4's input is inferred per-schema (Output ≠ Input); the generated
    // resolver is structurally equivalent, so cast to the RHF Resolver<T>.
    resolver: zodResolver(schema as never) as Resolver<T>,
    defaultValues,
    mode: "onTouched",
  });

  // Reset form to the latest defaultValues whenever the modal (re)opens —
  // covers switching between create mode and a different edit record.
  useEffect(() => {
    if (open) form.reset(defaultsRef.current as never);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) form.reset();
      }}
      title={title}
      description={description}
      size={size}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="hsm-form-modal" disabled={loading}>
            {loading && (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {submitLabel}
          </Button>
        </>
      }
    >
      <form
        id="hsm-form-modal"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-6"
      >
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {children(form as unknown as UseFormReturn<T>)}
      </form>
    </Modal>
  );
}
