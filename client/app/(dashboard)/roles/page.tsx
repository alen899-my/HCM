import type { Metadata } from "next";

import { PageLayout } from "@/components/common/PageLayout";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleUserRoundIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Roles — Roles & Permissions | HSM",
  description: "Manage RBAC roles.",
};

export default function RolesRoute() {
  return (
    <PageLayout
      title="Roles"
      description="Define roles and assign permissions."
      icon={<CircleUserRoundIcon className="size-5" />}
    >
      <Card className="border-border bg-card">
        <div className="flex flex-col items-start gap-3 p-8">
          <Badge variant="outline">Coming soon</Badge>
          <CardTitle className="text-base">Roles module is next in the RBAC rollout</CardTitle>
          <CardDescription>
            After resources, roles will let you group permissions and assign them to staff.
          </CardDescription>
        </div>
      </Card>
    </PageLayout>
  );
}