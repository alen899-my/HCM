"use client";

// components/common/SearchableSelect.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Theme-aware searchable select (combobox) built on Base UI Popover.
//
//   • Trigger looks/behaves like the shadcn SelectTrigger.
//   • Popup is portaled to <body> (not clipped, always above modals).
//   • Search box filters options as you type; Escape / outside click closes.
//   • Selected option shows a check; an option with value "" acts as "None".
//
// Usage:
//   <SearchableSelect
//     value={parentId}
//     onValueChange={(v) => setParent(v)}
//     options={[
//       { value: "", label: "None (top-level module)" },
//       { value: "abc", label: "Patient Management", hint: "PM" },
//     ]}
//     placeholder="Choose a parent…"
//   />
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { Popover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

export interface SearchableOption {
  value: string;
  label: string;
  /** Small muted text on the right of the option (e.g. code). */
  hint?: string;
}

interface SearchableSelectProps {
  id?: string;
  value?: string | null;
  onValueChange: (value: string | null) => void;
  options: SearchableOption[];
  placeholder?: string;
  /** Shown when the query matches nothing. */
  emptyMessage?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  /** Red border — match aria-invalid styling of other inputs. */
  invalid?: boolean;
  className?: string;
}

export function SearchableSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  emptyMessage = "No results found",
  searchPlaceholder = "Search…",
  disabled,
  invalid,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.hint?.toLowerCase().includes(q)
    );
  }, [options, query]);

  const pick = (optionValue: string) => {
    onValueChange(optionValue === "" ? null : optionValue);
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover.Root open={open} onOpenChange={(next) => {
      setOpen(next);
      if (!next) setQuery("");
    }}>
      <Popover.Trigger
        id={id}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        data-placeholder={!selected ? true : undefined}
        className={cn(
          "flex h-12 w-full cursor-pointer items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-3.5 text-sm text-foreground whitespace-nowrap transition-colors outline-none select-none data-placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className
        )}
        render={(props) => <button type="button" {...props} />}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDownIcon
          className={cn(
            "pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="start"
          sideOffset={6}
          className="isolate z-50"
        >
          <Popover.Popup className="relative isolate w-72 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none">
            {/* ── Search box ─────────────────────────────────────────── */}
            <div className="border-b p-2">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  autoFocus
                  className="h-9 w-full rounded-md border border-input bg-transparent pr-3 pl-8 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
            </div>

            {/* ── Options ────────────────────────────────────────────── */}
            <div className="hsm-scrollbar max-h-56 overflow-y-auto p-1" role="listbox">
              {filtered.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => pick(option.value)}
                    className={cn(
                      "relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 pr-7 text-left text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="flex-1 truncate">{option.label}</span>
                    {option.hint && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {option.hint}
                      </span>
                    )}
                    {isSelected && (
                      <CheckIcon className="absolute right-2 size-4 shrink-0" />
                    )}
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center text-xs text-muted-foreground">
                  {emptyMessage}
                </p>
              )}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
