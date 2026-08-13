"use client";

// components/common/FilterBar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Common inline filter bar — rendered ABOVE the table, full width,
// responsive (controls wrap). Shown only when `open` is true.
// Toggle it via <FilterToggle /> in the page actions row.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";

export interface FilterBarProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ open, children, className }: FilterBarProps) {
  if (!open) return null;

  return (
    <div
      id="hsm-filter-bar"
      className={cn(
        "flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end",
        className
      )}
    >
      {children}
    </div>
  );
}
