// features/permissions/store.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zustand store for the Permissions list page — selected rows for bulk actions.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";

interface PermissionSelectionState {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  toggleSelectedId: (id: string) => void;
  clearSelected: () => void;
}

export const usePermissionSelectionStore = create<PermissionSelectionState>()((set) => ({
  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  toggleSelectedId: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id],
    })),
  clearSelected: () => set({ selectedIds: [] }),
}));