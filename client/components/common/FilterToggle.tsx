"use client";

// components/common/FilterToggle.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Common filter toggle button — icon only, with an active-filter count badge.
// Place it next to the create button in a page's actions row.
// The filters themselves are rendered inline in a <FilterBar /> above the
// table, controlled by the same `open` state.
// ─────────────────────────────────────────────────────────────────────────────

import { SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterToggleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Number of currently-active filters — badge on the icon. */
  activeCount?: number;
}

export function FilterToggle({ open, onOpenChange, activeCount = 0 }: FilterToggleProps) {
  return (
    <Button
      variant={open ? "secondary" : "outline"}
      size="icon-sm"
      onClick={() => onOpenChange(!open)}
      aria-expanded={open}
      aria-controls="hsm-filter-bar"
      aria-label="Toggle filters"
      className="relative"
    >
      <SlidersHorizontalIcon />
      {activeCount > 0 && (
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground tabular-nums ring-2 ring-background">
          {activeCount}
        </span>
      )}
    </Button>
  );
}
