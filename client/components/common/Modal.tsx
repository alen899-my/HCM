"use client";

// components/common/Modal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Common customizable modal built on the shadcn/Base-UI Dialog primitive.
//
//   • Sizes: sm (default) → xl via the `size` prop.
//   • Header (title + description), body (children) and optional footer slot.
//   • Fully theme-aware via global CSS tokens.
//
// Controlled from the parent with `open` / `onOpenChange`.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SIZE_CLASSES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
} as const;

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  /** Modal width: sm | md | lg | xl (default md). */
  size?: keyof typeof SIZE_CLASSES;
  /** Optional footer content — buttons rendered at the bottom. */
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  footer,
  showCloseButton = true,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(SIZE_CLASSES[size], className)}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="pr-6">
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="hsm-scrollbar max-h-[60vh] overflow-y-auto px-0.5 py-1">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
