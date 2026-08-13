"use client";

// components/common/PageLayout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Vercel-style page layout — compact header row (title / description /
// actions) + content, with page padding on all sides (never touches the
// sidebar or the right edge). No card shell; content is full width.
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
    <div className={cn("flex min-w-0 flex-col gap-4 px-4 pt-4 pb-6 sm:px-6 sm:pt-5", className)}>
      {/* ── Header — compact, Vercel-style ─────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h1>
            {description && (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {/* ── Content — nothing left of the sidebar / right edge ─────────── */}
      <div className="min-w-0">{children}</div>
    </div>
  );
}