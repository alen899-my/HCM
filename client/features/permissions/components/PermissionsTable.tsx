"use client";

// features/permissions/components/PermissionsTable.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Permission list table built on the common DataTable — columns, badges and
// the row action buttons (view / edit / delete).
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
import type { Permission } from "../types";

interface PermissionsTableProps {
  data: Permission[];
  loading?: boolean;
  pagination: DataTablePagination;
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  selectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
  onEdit: (permission: Permission) => void;
  onView: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
}

export function PermissionsTable({
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
}: PermissionsTableProps) {
  const columns: DataTableColumn<Permission>[] = [
    {
      key: "name",
      header: "Permission",
      sortable: true,
      sortValue: (p) => p.name.toLowerCase(),
      cell: (p) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{p.name}</span>
          <span className="text-xs text-muted-foreground">{p.description || "—"}</span>
        </div>
      ),
    },
    {
      key: "code",
      header: "Code",
      sortable: true,
      sortValue: (p) => p.code.toLowerCase(),
      cell: (p) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
          {p.code}
        </code>
      ),
    },
    {
      key: "resource_name",
      header: "Resource",
      sortable: true,
      sortValue: (p) => p.resource_name.toLowerCase(),
      cell: (p) => (
        <span className="text-sm text-muted-foreground">{p.resource_name}</span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      align: "center",
      sortable: true,
      sortValue: (p) => p.is_active,
      cell: (p) =>
        p.is_active ? (
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
      sortValue: (p) => new Date(p.created_at).getTime(),
      cell: (p) => (
        <span className="text-sm text-muted-foreground">{formatDateTime(p.created_at)}</span>
      ),
    },
  ];

  return (
    <DataTable<Permission>
      columns={columns}
      data={data}
      loading={loading}
      rowKey={(p) => p.id}
      sort={sort}
      onSortChange={onSortChange}
      selectedKeys={selectedKeys}
      onSelectedKeysChange={onSelectedKeysChange}
      pagination={pagination}
      emptyText="No permissions found. Create your first permission to start building RBAC."
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