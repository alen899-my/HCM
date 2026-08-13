"use client";

// features/permissions/components/PermissionsPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Permissions module page (client component, mounted by app/(dashboard)/permissions/page).
// Compose: PageLayout + toolbar (filter toggle / create button)
//         + PermissionsTable + create|edit FormModal + details Modal
//         + delete ConfirmDialog.
// ─────────────────────────────────────────────────────────────────────────────

import { useDeferredValue, useMemo, useState, type ChangeEvent } from "react";
import { PlusIcon, RotateCcwIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLayout } from "@/components/common/PageLayout";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FilterToggle } from "@/components/common/FilterToggle";
import { FilterBar } from "@/components/common/FilterBar";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePermissions, useCreatePermission, useUpdatePermission, useDeletePermission } from "../hooks";
import { usePermissionSelectionStore } from "../store";
import { type Permission } from "../types";
import { useResources } from "@/features/resources/hooks";
import type { DataTableSort } from "@/components/common/DataTable";
import type { PermissionFormValues } from "@/lib/validations/permission.schema";
import { PermissionsTable } from "./PermissionsTable";
import { PermissionFormModal } from "./PermissionFormModal";
import { PermissionDetailsModal } from "./PermissionDetailsModal";

type StatusFilter = "" | "true" | "false";

export function PermissionsPage() {
  // ── Query state ────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const deferredSearch = useDeferredValue(searchInput.trim());

  const ORDER_FIELDS: Record<string, string> = {
    name: "name",
    code: "code",
    resource_name: "resource__name",
    is_active: "is_active",
    created_at: "created_at",
  };

  const params = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search: deferredSearch || undefined,
      resource: resourceFilter || undefined,
      is_active: status || undefined,
      ordering: sort
        ? `${sort.direction === "desc" ? "-" : ""}${ORDER_FIELDS[sort.key] ?? "resource__name"}`
        : "resource__name",
    }),
    [page, pageSize, deferredSearch, resourceFilter, status, sort]
  );

  const { data, total, loading, error: listError, refetch } = usePermissions(params);

  // All active resources — for the form's resource selector.
  const { data: allResources } = useResources({
    page: 1,
    page_size: 100,
    is_active: "true",
    ordering: "name",
  });

  // ── Selection ──────────────────────────────────────────────────────────
  const selectedIds = usePermissionSelectionStore((s) => s.selectedIds);
  const setSelectedIds = usePermissionSelectionStore((s) => s.setSelectedIds);
  const clearSelected = usePermissionSelectionStore((s) => s.clearSelected);

  // ── Create / Edit / View / Delete state ────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);
  const [viewing, setViewing] = useState<Permission | null>(null);
  const [deleting, setDeleting] = useState<Permission | null>(null);

  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();
  const deleteMutation = useDeletePermission();

  // "Add another" flow: after a successful create the modal stays open with
  // the same resource pre-selected, so more permissions can be added quickly.
  const [formResetKey, setFormResetKey] = useState(0);
  const [lastResource, setLastResource] = useState("");

  const mutationError = createMutation.error ?? updateMutation.error ?? deleteMutation.error;
  const mutating = createMutation.loading || updateMutation.loading || deleteMutation.loading;

  const openCreate = () => {
    createMutation.clearError();
    updateMutation.clearError();
    setEditing(null);
    setFormOpen(true);
  };  const openEdit = (permission: Permission) => {
    createMutation.clearError();
    updateMutation.clearError();
    setEditing(permission);
    setFormOpen(true);
  };

  const handleSubmit = async (values: PermissionFormValues, addMore = false) => {
    const success = editing
      ? await updateMutation.update(editing.id, values)
      : await createMutation.create(values);

    if (success) {
      await refetch();
      if (editing || !addMore) {
        setFormOpen(false);
      } else {
        setLastResource(values.resource);
        setFormResetKey((k) => k + 1);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const success = await deleteMutation.remove(deleting.id);
    if (success) {
      clearSelected();
      setDeleting(null);
      await refetch();
    }
  };

  // ── Filters ───────────────────────────────────────────────────────────
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const activeFilterCount =
    (deferredSearch ? 1 : 0) + (resourceFilter ? 1 : 0) + (status ? 1 : 0);

  return (
    <PageLayout
      title="Permissions"
      description="Named permissions scoped to system resources."
      actions={
        <>
          <FilterToggle
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            activeCount={activeFilterCount}
          />

          <Button onClick={openCreate}>
            <PlusIcon />
            Add Permission
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* ── Inline filter bar — above the table, shown on toggle ──────── */}
        <FilterBar open={filtersOpen}>
          {/* ── Search ─────────────────────────────────────────────────── */}
          <div className="relative w-full sm:w-56">
            <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search name, code, description or resource…"
              className="pl-8"
              aria-label="Search permissions"
            />
          </div>

          {/* ── Resource filter — searchable select ─────────────────────── */}
          <div className="w-full sm:w-64">
            <SearchableSelect
              id="filter-resource"
              value={resourceFilter || null}
              onValueChange={(value) => {
                setResourceFilter(value ?? "");
                setPage(1);
              }}
              placeholder="Filter by resource…"
              searchPlaceholder="Search resources…"
              emptyMessage="No matching resources"
              options={allResources
                .filter((r) => r.is_active)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((r) => ({ value: r.id, label: r.name, hint: r.code }))}
            />
          </div>

          {/* ── Status filter ──────────────────────────────────────────── */}
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as StatusFilter);
              setPage(1);
            }}
          >
            <SelectTrigger size="sm" className="w-full sm:w-36" aria-label="Filter by status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="true">Active only</SelectItem>
              <SelectItem value="false">Inactive only</SelectItem>
            </SelectContent>
          </Select>

          {/* ── Reset filters — shown when anything is active ────────────── */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("");
                setResourceFilter("");
                setStatus("");
                setPage(1);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcwIcon />
              Reset filters
            </Button>
          )}
        </FilterBar>

        {selectedIds.length > 0 && (
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{selectedIds.length}</span> selected
          </span>
        )}

        {listError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {listError}
          </div>
        )}

        {/* ── Table ───────────────────────────────────────────────────── */}
        <PermissionsTable
          data={data}
          loading={loading}
          pagination={{
            page,
            pageSize,
            total,
            onPageChange: (p) => setPage(p),
            onPageSizeChange: (s) => {
              setPageSize(s);
              setPage(1);
            },
          }}
          sort={sort}
          onSortChange={(nextSort) => {
            setSort(nextSort);
            setPage(1);
          }}
          selectedKeys={selectedIds}
          onSelectedKeysChange={setSelectedIds}
          onEdit={openEdit}
          onView={(p) => setViewing(p)}
          onDelete={(p) => setDeleting(p)}
        />

        {/* ── Create / Edit modal ─────────────────────────────────────── */}
        <PermissionFormModal
          open={formOpen}
          onOpenChange={setFormOpen}
          permission={editing}
          resources={allResources}
          onSubmit={handleSubmit}
          loading={mutating}
          error={mutationError}
          resetKey={formResetKey}
          defaultResource={lastResource}
        />

        {/* ── Details modal ───────────────────────────────────────────── */}
        <PermissionDetailsModal
          open={!!viewing}
          onOpenChange={(open) => !open && setViewing(null)}
          permission={viewing}
        />

        {/* ── Delete confirmation ─────────────────────────────────────── */}
        <ConfirmDialog
          open={!!deleting}
          onOpenChange={(open) => !open && setDeleting(null)}
          title="Delete Permission"
          description={
            deleting
              ? `"${deleting.name}" will be soft-deleted and removed from role assignment screens.`
              : undefined
          }
          confirmLabel="Delete"
          loading={deleteMutation.loading}
          onConfirm={handleDelete}
        />
      </div>
    </PageLayout>
  );
}