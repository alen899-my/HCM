import type { Metadata } from "next";

import { ResourcesPage } from "@/features/resources/components/ResourcesPage";

export const metadata: Metadata = {
  title: "Resources — Roles & Permissions | HSM",
  description: "Manage RBAC system resources — modules and sub-modules.",
};

export default function ResourcesRoute() {
  return <ResourcesPage />;
}