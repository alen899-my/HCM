// features/resources/store.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zustand store for the Resources list page — selected rows for bulk actions.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";

interface ResourceSelectionState {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  toggleSelectedId: (id: string) => void;
  clearSelected: () => void;
}

export const useResourceSelectionStore = create<ResourceSelectionState>()((set) => ({
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
