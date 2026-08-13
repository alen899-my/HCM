"use client";

// features/resources/components/ResourcesTable.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Resource list table built on the common DataTable — columns, badges,
// and the row action buttons (edit / delete).
// ─────────────────────────────────────────────────────────────────────────────

import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  type DataTableColumn,
  type DataTablePagination,
  type DataTableSort,
} from "@/components/common/DataTable";
import { formatDateTime } from "@/lib/format";
import type { Resource } from "../types";

interface ResourcesTableProps {
  data: Resource[];
  loading?: boolean;
  pagination: DataTablePagination;
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  selectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
  onEdit: (resource: Resource) => void;
  onView: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
}

const columns: DataTableColumn<Resource>[] = [
  {
    key: "name",
    header: "Resource",
    sortable: true,
    sortValue: (r) => r.name.toLowerCase(),
    cell: (r) => (
      <div className="flex flex-col">
        <span className="font-semibold text-foreground">{r.name}</span>
        <span className="text-xs text-muted-foreground">{r.description || "—"}</span>
      </div>
    ),
  },
  {
    key: "code",
    header: "Code",
    sortable: true,
    sortValue: (r) => r.code.toLowerCase(),
    cell: (r) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
        {r.code}
      </code>
    ),
  },
  {
    key: "parent_code",
    header: "Parent",
    sortable: true,
    sortValue: (r) => r.parent_code ?? "",
    cell: (r) =>
      r.parent_code ? (
        <span className="text-sm text-muted-foreground">{r.parent_code}</span>
      ) : (
        <Badge variant="outline">Top-level</Badge>
      ),
  },
  {
    key: "is_active",
    header: "Status",
    sortable: true,
    align: "center",
    sortValue: (r) => r.is_active,
    cell: (r) =>
      r.is_active ? (
        <Badge className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
          Active
        </Badge>
      ) : (
        <Badge variant="destructive">Inactive</Badge>
      ),
  },
  {
    key: "created_at",
    header: "Created",
    align: "right",
    sortable: true,
    sortValue: (r) => new Date(r.created_at).getTime(),
    cell: (r) => (
      <span className="text-sm text-muted-foreground">{formatDateTime(r.created_at)}</span>
    ),
  },
];

export function ResourcesTable({
  data,
  loading,
  pagination,
  sort,
  onSortChange,
  selectedKeys,
  onSelectedKeysChange,
  onEdit,
  onView,
  onDelete,
}: ResourcesTableProps) {
  return (
    <DataTable<Resource>
      columns={columns}
      data={data}
      loading={loading}
      rowKey={(r) => r.id}
      sort={sort}
      onSortChange={onSortChange}
      selectedKeys={selectedKeys}
      onSelectedKeysChange={onSelectedKeysChange}
      pagination={pagination}
      emptyText="No resources found. Create your first resource to start building RBAC."
      actions={(row) => (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onView(row)}
            aria-label={`View ${row.name}`}
            className="text-muted-foreground hover:text-foreground"
          >
            <EyeIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row)}
            aria-label={`Edit ${row.name}`}
            className="text-muted-foreground hover:text-foreground"
          >
            <PencilIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            aria-label={`Delete ${row.name}`}
            className="text-destructive hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        </>
      )}
    />
  );
}