"use client";

// components/common/DataTable.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Common full-width, dense (excel/Vercel-style) data table for HSM list pages.
//
//   • Full width — no card wrapper, no rounded shell, no shadow
//   • Sortable headers — click a column to toggle asc → desc → none;
//     values are compared by type (string / number / Date / boolean)
//   • Checkbox column on the LEFT (select-all for the current page)
//   • S.No column (numbering continues across pages)
//   • Scrollable body + sticky header (maxHeight), skeleton rows, empty state
//   • Action buttons injected via the `actions` render prop
//   • Slim server-driven pagination footer
//
// Usage:
//   <DataTable
//     columns={[
//       { key: "name", header: "Name", sortable: true, cell: (r) => r.name },
//       { key: "created_at", header: "Created", sortable: true, align: "right",
//         sortValue: (r) => new Date(r.created_at).getTime(), cell: (r) => ... },
//     ]}
//     data={items}
//     loading={loading}
//     rowKey={(r) => r.id}
//     sort={sort}
//     onSortChange={setSort}          // e.g. → API ordering param
//     actions={(row) => <Button onClick={() => onEdit(row)}>Edit</Button>}
//     pagination={{ page, pageSize, total, onPageChange }}
//   />
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxIcon,
} from "lucide-react";

export type SortDirection = "asc" | "desc";

export interface DataTableSort {
  key: string;
  direction: SortDirection;
}

export interface DataTableColumn<T> {
  key: string;
  header: string;
  /** Left / center / right alignment of the header and every cell. */
  align?: "left" | "center" | "right";
  /** Make the header clickable; toggles asc → desc → none. */
  sortable?: boolean;
  /** Value used for sorting when `sortable` — falls back to `row[key]`. */
  sortValue?: (row: T) => string | number | Date | boolean | null | undefined;
  className?: string;
  cell: (row: T) => React.ReactNode;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  rowKey: (row: T) => string;
  /** Current sort — controlled. */
  sort?: DataTableSort | null;
  /** Fired on header click: `{key, direction}` or `null` to clear. */
  onSortChange?: (sort: DataTableSort | null) => void;
  /** Action buttons column — passed as a render prop. */
  actions?: (row: T) => React.ReactNode;
  /** Show the selection checkbox column (left). Default true. */
  checkboxColumn?: boolean;
  /** Show the S.No column. Default true. */
  snoColumn?: boolean;
  /** Max height of the scrollable body — "calc(100vh - 20rem)" by default. */
  maxHeight?: string;
  /** Text shown when the table is empty. */
  emptyText?: string;
  /** Controlled selection keys. */
  selectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
  pagination?: DataTablePagination;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/** Type-aware comparison so each column sorts naturally by its data type. */
function compareValues(
  a: string | number | Date | boolean | null | undefined,
  b: string | number | Date | boolean | null | undefined
): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1; // nulls always last
  if (b == null) return -1;
  if (a instanceof Date || b instanceof Date) {
    return Number(a) - Number(b);
  }
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  rowKey,
  sort,
  onSortChange,
  actions,
  checkboxColumn = true,
  snoColumn = true,
  maxHeight = "calc(100vh - 20rem)",
  emptyText = "No records found.",
  selectedKeys = [],
  onSelectedKeysChange,
  pagination,
  className,
}: DataTableProps<T>) {
  const pageKeys = data.map(rowKey);
  const allSelected = pageKeys.length > 0 && pageKeys.every((k) => selectedKeys.includes(k));
  const someSelected = pageKeys.some((k) => selectedKeys.includes(k));

  const toggleRow = (key: string) => {
    if (!onSelectedKeysChange) return;
    onSelectedKeysChange(
      selectedKeys.includes(key)
        ? selectedKeys.filter((k) => k !== key)
        : [...selectedKeys, key]
    );
  };

  const toggleAll = (checked: boolean) => {
    if (!onSelectedKeysChange) return;
    onSelectedKeysChange(
      checked
        ? Array.from(new Set([...selectedKeys, ...pageKeys]))
        : selectedKeys.filter((k) => !pageKeys.includes(k))
    );
  };

  // ── Client-side sort of the current page (mirrors the server ordering) ──
  const sortedData = useMemo(() => {
    if (!sort || loading) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col || !col.sortable) return data;
    const getValue =
      col.sortValue ?? ((row: T) => (row as unknown as Record<string, unknown>)[sort.key] as string | number | Date | boolean | null | undefined);
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => compareValues(getValue(a), getValue(b)) * dir);
  }, [data, sort, loading, columns]);

  const handleSortClick = (col: DataTableColumn<T>) => () => {
    if (!onSortChange) return;
    if (sort?.key !== col.key) onSortChange({ key: col.key, direction: "asc" });
    else if (sort.direction === "asc") onSortChange({ key: col.key, direction: "desc" });
    else onSortChange(null);
  };

  const totalColumns =
    (checkboxColumn ? 1 : 0) + (snoColumn ? 1 : 0) + columns.length + (actions ? 1 : 0);

  const startRow = pagination ? (pagination.page - 1) * pagination.pageSize + 1 : 1;

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  } as const;

  return (
    <div className={cn("w-full min-w-0", className)}>
      {/* ── Scrollable table body ─────────────────────────────────────── */}
      <div className="hsm-scrollbar w-full overflow-auto" style={{ maxHeight }}>
        <Table className="w-full text-sm">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="border-b border-primary bg-primary hover:bg-primary dark:bg-primary/90 dark:hover:bg-primary/90 dark:border-primary/80">
              {checkboxColumn && (
                <TableHead className="w-9 border-r border-primary-foreground/20 py-1.5 pl-2 pr-0">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={!allSelected && someSelected}
                    onCheckedChange={toggleAll}
                    disabled={loading || data.length === 0}
                    aria-label="Select all rows"
                    className="border-primary-foreground/40 text-primary data-checked:border-primary-foreground data-checked:bg-primary-foreground data-checked:text-primary"
                  />
                </TableHead>
              )}
              {snoColumn && (
                <TableHead className="w-12 border-r border-primary-foreground/20 py-1.5 pr-0 text-primary-foreground/90">
                  <span className="text-[11px] font-semibold tracking-wide uppercase">S.No</span>
                </TableHead>
              )}
              {columns.map((col) => {
                const active = sort?.key === col.key;
                const align = alignClass[col.align ?? "left"];
                return (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "border-r border-primary-foreground/20 py-0 last:border-r-0",
                      col.className
                    )}
                    aria-sort={
                      active
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={handleSortClick(col)}
                        disabled={!onSortChange}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-1 rounded-md px-1.5 py-1.5 text-[11px] font-semibold tracking-wide text-primary-foreground uppercase outline-none transition-colors select-none focus-visible:ring-3 focus-visible:ring-primary-foreground/50 hover:bg-primary-foreground/10 disabled:cursor-default disabled:opacity-60",
                          align,
                          active && "font-bold"
                        )}
                      >
                        <span>{col.header}</span>
                        {active ? (
                          sort.direction === "asc" ? (
                            <ArrowUpIcon className="size-3.5 shrink-0 text-primary-foreground" />
                          ) : (
                            <ArrowDownIcon className="size-3.5 shrink-0 text-primary-foreground" />
                          )
                        ) : (
                          <ArrowUpDownIcon className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                        )}
                      </button>
                    ) : (
                      <div className={cn("px-1.5 py-1 text-[11px] font-semibold tracking-wide text-primary-foreground/90 uppercase", align)}>
                        {col.header}
                      </div>
                    )}
                  </TableHead>
                );
              })}
              {actions && (
                <TableHead className="w-20 border-l border-primary-foreground/20 py-1.5 pr-2 text-right text-[11px] font-semibold tracking-wide text-primary-foreground uppercase">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="border-b border-border/60 dark:border-border/80">
                  {Array.from({ length: totalColumns }).map((__, j) => (
                    <TableCell
                      key={j}
                      className="border-r border-black/30 px-2 py-1.5 last:border-r-0 dark:border-border/70"
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : sortedData.length === 0 ? (
              <TableRow className="border-b border-border/60">
                <TableCell colSpan={totalColumns} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <InboxIcon className="size-6" />
                    <span className="text-sm">{emptyText}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, idx) => {
                const key = rowKey(row);
                const selected = selectedKeys.includes(key);
                return (
                  <TableRow
                    key={key}
                    className={cn(
                      "border-b border-border/60 transition-colors hover:bg-primary/10 dark:border-border/80 dark:hover:bg-primary/20",
                      (idx + startRow) % 2 === 0 && "bg-muted/25 dark:bg-muted/15",
                      selected &&
                        "bg-primary/15 hover:bg-primary/15 dark:bg-primary/30 dark:hover:bg-primary/30"
                    )}
                  >
                    {checkboxColumn && (
                      <TableCell className="border-r border-black/30 py-1.5 pl-2 pr-0 dark:border-border/70">
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => toggleRow(key)}
                          aria-label={`Select row ${idx + 1}`}
                        />
                      </TableCell>
                    )}
                    {snoColumn && (
                      <TableCell className="border-r border-black/30 py-1.5 pr-0 text-muted-foreground tabular-nums dark:border-border/70">
                        {startRow + idx}
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn(
                          "border-r border-black/30 py-1.5 last:border-r-0 dark:border-border/70",
                          alignClass[col.align ?? "left"],
                          col.className
                        )}
                      >
                        {col.cell(row)}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell className="border-l border-black/30 py-1.5 dark:border-border/70">
                        <div className="flex items-center justify-end gap-0.5">
                          {actions(row)}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Slim pagination footer ────────────────────────────────────── */}
      {pagination && (
        <div className="flex flex-col gap-2 border-t border-border/60 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground tabular-nums">
            Showing{" "}
            <span className="font-medium text-foreground">
              {pagination.total === 0 ? 0 : startRow}
            </span>
            {" – "}
            <span className="font-medium text-foreground">
              {Math.min(startRow + data.length - 1, pagination.total)}
            </span>
            {" of "}
            <span className="font-medium text-foreground">{pagination.total}</span>
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Rows / page</span>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(v) => pagination.onPageSizeChange?.(Number(v))}
              >
                <SelectTrigger
                  size="sm"
                  className="h-7 min-w-14 justify-between"
                  aria-label="Rows per page"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeftIcon />
              </Button>
              <span className="px-1 text-xs font-medium text-muted-foreground tabular-nums">
                Page {pagination.page}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                aria-label="Next page"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}