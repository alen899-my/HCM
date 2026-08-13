"use client";

// components/common/PageLayout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Vercel-style page layout — clean, minimal, no card shells.
// Header row (title / description / actions) + full-width content below.
// Fully theme-aware via global CSS tokens.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";

export interface PageLayoutProps {
  /** Page title shown in the header row. */
  title: string;
  /** Optional one-line description under the title. */
  description?: string;
  /** Optional icon rendered beside the title (lucide icon element). */
  icon?: React.ReactNode;
  /** Action buttons rendered on the right of the header (Create, Export…). */
  actions?: React.ReactNode;
  /** Page content — tables, forms, grids. Rendered full-width below. */
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({
  title,
  description,
  icon,
  actions,
  children,
  className,
}: PageLayoutProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-5", className)}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h1>
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {/* ── Content — full width, no card wrapper ─────────────────────── */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
