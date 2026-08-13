"use client";

// features/permissions/components/PermissionDetailsModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Read-only Permission details modal — clean definition-list layout.
// ─────────────────────────────────────────────────────────────────────────────

import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import { type Permission } from "../types";

interface PermissionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: Permission | null;
}

function DetailItem({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function PermissionDetailsModal({
  open,
  onOpenChange,
  permission,
}: PermissionDetailsModalProps) {
  if (!permission) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={permission.name}
      description={
        <>
          Permission · <code className="font-mono text-xs">{permission.code}</code>
        </>
      }
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <DetailItem label="Permission Name">
          <span className="font-medium">{permission.name}</span>
        </DetailItem>

        <DetailItem label="Resource">
          <span className="font-medium">{permission.resource_name}</span>
          <span className="ml-1.5 font-mono text-xs text-muted-foreground">
            ({permission.resource_code})
          </span>
        </DetailItem>

        <DetailItem label="Code">
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium">
            {permission.code}
          </code>
        </DetailItem>

        <DetailItem label="Status">
          {permission.is_active ? (
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
              Active
            </Badge>
          ) : (
            <Badge variant="destructive">Inactive</Badge>
          )}
        </DetailItem>

        <DetailItem label="Description" className="sm:col-span-2">
          <span className="text-muted-foreground">{permission.description || "—"}</span>
        </DetailItem>

        <DetailItem label="Created">
          <span className="text-muted-foreground">{formatDateTime(permission.created_at)}</span>
        </DetailItem>

        <DetailItem label="Last updated">
          <span className="text-muted-foreground">{formatDateTime(permission.updated_at)}</span>
        </DetailItem>
      </dl>
    </Modal>
  );
}