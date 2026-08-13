"use client";

// features/resources/components/ResourceDetailsModal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Read-only Resource details modal — shows every field of a resource in a
// clean definition-list layout (labels above values, responsive 2-col grid).
// ─────────────────────────────────────────────────────────────────────────────

import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import type { Resource } from "../types";

interface ResourceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: Resource | null;
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

export function ResourceDetailsModal({
  open,
  onOpenChange,
  resource,
}: ResourceDetailsModalProps) {
  if (!resource) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={resource.name}
      description={
        <>
          System resource · <code className="font-mono text-xs">{resource.code}</code>
        </>
      }
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <DetailItem label="Code">
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
            {resource.code}
          </code>
        </DetailItem>

        <DetailItem label="Parent">
          {resource.parent_code ? (
            <span className="font-medium">{resource.parent_code}</span>
          ) : (
            <Badge variant="outline">Top-level</Badge>
          )}
        </DetailItem>

        <DetailItem label="Status">
          {resource.is_active ? (
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
              Active
            </Badge>
          ) : (
            <Badge variant="destructive">Inactive</Badge>
          )}
        </DetailItem>

        <DetailItem label="Sub-resources">
          {resource.children_count}{" "}
          {resource.children_count === 1 ? "child module" : "child modules"}
        </DetailItem>

        <div className="sm:col-span-2">
          <DetailItem label="Description">
            {resource.description || (
              <span className="text-muted-foreground italic">No description provided.</span>
            )}
          </DetailItem>
        </div>

        <DetailItem label="Created">
          <span className="text-muted-foreground">{formatDateTime(resource.created_at)}</span>
        </DetailItem>

        <DetailItem label="Last updated">
          <span className="text-muted-foreground">{formatDateTime(resource.updated_at)}</span>
        </DetailItem>
      </dl>
    </Modal>
  );
}
