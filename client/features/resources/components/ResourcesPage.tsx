"use client";

// features/resources/components/ResourcesPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Resources module page (client component, mounted by app/(dashboard)/resources/page).
// Compose: PageLayout + toolbar (search / status filter / create button)
//         + ResourcesTable + create|edit FormModal + delete ConfirmDialog.
// ─────────────────────────────────────────────────────────────────────────────

import { useDeferredValue, useMemo, useState, type ChangeEvent } from "react";
import { PlusIcon, RotateCcwIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLayout } from "@/components/common/PageLayout";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { FilterToggle } from "@/components/common/FilterToggle";
import { FilterBar } from "@/components/common/FilterBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResources, useCreateResource, useUpdateResource, useDeleteResource } from "../hooks";
import { useResourceSelectionStore } from "../store";
import type { Resource } from "../types";
import type { DataTableSort } from "@/components/common/DataTable";
import type { ResourceFormValues } from "@/lib/validations/resource.schema";
import { ResourcesTable } from "./ResourcesTable";
import { ResourceFormModal } from "./ResourceFormModal";
import { ResourceDetailsModal } from "./ResourceDetailsModal";

type StatusFilter = "" | "true" | "false";

export function ResourcesPage() {
  // ── Query state ────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [sort, setSort] = useState<DataTableSort | null>(null);
  const deferredSearch = useDeferredValue(searchInput.trim());

  const ORDER_FIELDS: Record<string, string> = {
    name: "name",
    code: "code",
    parent_code: "parent_code",
    is_active: "is_active",
    created_at: "created_at",
  };

  const params = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search: deferredSearch || undefined,
      is_active: status || undefined,
      ordering: sort
        ? `${sort.direction === "desc" ? "-" : ""}${ORDER_FIELDS[sort.key] ?? "name"}`
        : "name",
    }),
    [page, pageSize, deferredSearch, status, sort]
  );

  const { data, total, loading, error: listError, refetch } = useResources(params);

  // ── Selection ──────────────────────────────────────────────────────────
  const selectedIds = useResourceSelectionStore((s) => s.selectedIds);
  const setSelectedIds = useResourceSelectionStore((s) => s.setSelectedIds);
  const clearSelected = useResourceSelectionStore((s) => s.clearSelected);

  // ── Create / Edit / Delete state ───────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [viewing, setViewing] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState<Resource | null>(null);

  const createMutation = useCreateResource();
  const updateMutation = useUpdateResource();
  const deleteMutation = useDeleteResource();

  const mutationError = createMutation.error ?? updateMutation.error ?? deleteMutation.error;
  const mutating = createMutation.loading || updateMutation.loading || deleteMutation.loading;

  const openCreate = () => {
    createMutation.clearError();
    updateMutation.clearError();
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (resource: Resource) => {
    createMutation.clearError();
    updateMutation.clearError();
    setEditing(resource);
    setFormOpen(true);
  };

  const handleSubmit = async (values: ResourceFormValues) => {
    const success = editing
      ? await updateMutation.update(editing.id, values)
      : await createMutation.create(values);

    if (success) {
      setFormOpen(false);
      await refetch();
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

  const activeFilterCount = (deferredSearch ? 1 : 0) + (status ? 1 : 0);

  return (
    <PageLayout
      title="Resources"
      description="System resources (modules & sub-modules) that RBAC permissions will be scoped to."
      actions={
        <>
          <FilterToggle
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            activeCount={activeFilterCount}
          />

          <Button onClick={openCreate}>
            <PlusIcon />
            Add Resource
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
              placeholder="Search name or code…"
              className="pl-8"
              aria-label="Search resources"
            />
          </div>

          {/* ── Status filter ───────────────────────────────────────────── */}
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
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* ── Reset filters — shown when anything is active ────────────── */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("");
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
        <ResourcesTable
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
          selectedKeys={selectedIds}
          onSelectedKeysChange={setSelectedIds}
          sort={sort}
          onSortChange={(nextSort) => {
            setSort(nextSort);
            setPage(1);
          }}
          onEdit={openEdit}
          onView={(r) => setViewing(r)}
          onDelete={(r) => setDeleting(r)}
        />

        {/* ── Details modal ───────────────────────────────────────────── */}
        <ResourceDetailsModal
          open={!!viewing}
          onOpenChange={(open) => !open && setViewing(null)}
          resource={viewing}
        />

        {/* ── Create / Edit modal ─────────────────────────────────────── */}
        <ResourceFormModal
          open={formOpen}
          onOpenChange={setFormOpen}
          resource={editing}
          resources={data}
          onSubmit={handleSubmit}
          loading={mutating}
          error={mutationError}
        />

        {/* ── Delete confirmation ─────────────────────────────────────── */}
        <ConfirmDialog
          open={!!deleting}
          onOpenChange={(open) => !open && setDeleting(null)}
          title="Delete Resource"
          description={
            deleting
              ? `"${deleting.name}" will be soft-deleted and hidden from the system.`
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