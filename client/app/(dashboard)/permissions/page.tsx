import type { Metadata } from "next";

import { PageLayout } from "@/components/common/PageLayout";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeyRoundIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Permissions — Roles & Permissions | HSM",
  description: "Manage RBAC permissions.",
};

export default function PermissionsRoute() {
  return (
    <PageLayout
      title="Permissions"
      description="Granular permission actions scoped to resources."
      icon={<KeyRoundIcon className="size-5" />}
    >
      <Card className="border-border bg-card">
        <div className="flex flex-col items-start gap-3 p-8">
          <Badge variant="outline">Coming soon</Badge>
          <CardTitle className="text-base">Permissions module is planned after roles</CardTitle>
          <CardDescription>
            Permissions bind actions (create, read, update, delete, approve) to resources.
          </CardDescription>
        </div>
      </Card>
    </PageLayout>
  );
}