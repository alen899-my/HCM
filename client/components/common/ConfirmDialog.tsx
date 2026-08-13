"use client";

// components/common/ConfirmDialog.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Common destructive-confirmation modal (delete, deactivate, bulk actions…).
// Built on the common Modal so every confirmation in the app looks identical.
// ─────────────────────────────────────────────────────────────────────────────

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/common/Modal";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Show a spinner on the confirm button while the action runs. */
  loading?: boolean;
  /** Danger variant — red confirm button (default). */
  danger?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  danger = true,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        This action cannot be undone.
      </p>
    </Modal>
  );
}
