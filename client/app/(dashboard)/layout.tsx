// app/(dashboard)/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Authenticated portal layout — fixed sidebar + fixed header, scrollable content.
// Fully responsive Theme Switching (Light & Pitch Dark Mode #000000)
// ─────────────────────────────────────────────────────────────────────────────

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HSM Portal — Hospital Management System",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* ── Fixed Sidebar ───────────────────────────────────────────── */}
      <AppSidebar />

      {/* ── Main Panel ─────────────────────────────────────────────── */}
      <SidebarInset className="flex flex-col h-screen w-full overflow-hidden bg-background text-foreground min-w-0 flex-1 transition-colors duration-200">
        {/* Fixed Header */}
        <div className="sticky top-0 z-30 shrink-0 w-full bg-background">
          <AppHeader />
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto w-full p-4 md:p-6 bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
