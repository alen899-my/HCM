import type { Metadata } from "next";

import { PermissionsPage } from "@/features/permissions/components/PermissionsPage";

export const metadata: Metadata = {
  title: "Permissions — Roles & Permissions | HSM",
  description: "Manage RBAC permissions.",
};

export default function PermissionsRoute() {
  return <PermissionsPage />;
}