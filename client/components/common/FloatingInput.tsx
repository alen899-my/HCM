"use client";

// components/common/FloatingInput.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Common floating-label input / textarea.
//
//   • Label starts centered inside the field as the placeholder hint; on
//     focus or once filled it smoothly animates to a position ABOVE the
//     input field (outside the box) — never inside.
//   • A fixed spacer above the field reserves room for the floated label,
//     so nothing overlaps.
//   • Error state — red border + red label + inline Zod message below.
//   • Fully theme-aware; works with react-hook-form `register` spread.
//
// Usage:
//   <FloatingInput
//     id="resource-name"
//     label="Resource Name"
//     required
//     error={errors.name?.message}
//     {...register("name")}
//   />
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";

// Input is h-9 (36px) inside a wrapper with a 20px spacer above (pt-5),
// so the floated label keeps clear space above the field.
// Wrapper top → input vertical center = 20 + 18 = 38px = top-[2.375rem].
const labelRest = "top-[2.375rem] -translate-y-1/2 text-[15px]";

// Floated state — label sits ABOVE the input, in the reserved spacer.
const labelFloat =
  "group-focus-within:top-0 group-focus-within:-translate-y-0 group-focus-within:text-xs group-focus-within:font-semibold group-focus-within:text-primary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold";

const labelError =
  "text-destructive group-focus-within:text-destructive peer-[:not(:placeholder-shown)]:text-destructive";

const inputBase =
  "peer h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 group-focus-within:border-ring group-focus-within:ring-3 group-focus-within:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

const inputError =
  "border-destructive group-focus-within:border-destructive group-focus-within:ring-destructive/20 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

const labelBase =
  "pointer-events-none absolute left-3.5 leading-none text-muted-foreground transition-all duration-200 ease-out";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Zod / server validation message — red border + inline text. */
  error?: string;
}

export function FloatingInput({
  label,
  error,
  id,
  required,
  placeholder,
  className,
  ...props
}: FloatingInputProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="group relative pt-5">
        <input
          id={id}
          placeholder={placeholder ?? " "}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputBase, error && inputError)}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(labelBase, labelRest, labelFloat, error && labelError)}
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

interface FloatingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  /** Zod / server validation message — red border + inline text. */
  error?: string;
}

export function FloatingTextarea({
  label,
  error,
  id,
  required,
  placeholder,
  className,
  rows = 3,
  ...props
}: FloatingTextareaProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="group relative pt-5">
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder ?? " "}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            // min-h-20 (80px) → vertical center = 20 (spacer) + 40 = 60px = top-[3.75rem]
            "peer min-h-20 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 group-focus-within:border-ring group-focus-within:ring-3 group-focus-within:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error && inputError
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-3 leading-none text-muted-foreground transition-all duration-200 ease-out",
            "top-[3.75rem] -translate-y-1/2 text-[15px]",
            labelFloat,
            error && labelError
          )}
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
