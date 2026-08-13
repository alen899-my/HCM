"use client";

// components/layout/AppHeader.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Enterprise Responsive App Header with Theme Switching Support
// Reacts dynamically to Light and Pitch Dark Mode
// ─────────────────────────────────────────────────────────────────────────────

import { usePathname } from "next/navigation";
import {
  BellIcon,
  LogOutIcon,
  SearchIcon,
  UserCircleIcon,
  ActivityIcon,
} from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { useLogout } from "@/features/auth/hooks";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

// ─── Breadcrumb helpers ───────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  dashboard:       "Dashboard",
  patients:        "Patients",
  doctors:         "Doctors",
  appointments:    "Appointments",
  wards:           "Wards & Beds",
  pharmacy:        "Pharmacy",
  laboratory:      "Laboratory",
  billing:         "Billing",
  reports:         "Reports",
  settings:        "Settings",
  access:          "Access Control",
  resources:       "Resources",
  roles:           "Roles",
  permissions:     "Permissions",
  new:             "New",
  specializations: "Specializations",
  admissions:      "Admissions",
  medicines:       "Medicines",
  prescriptions:   "Prescriptions",
  results:         "Results",
  payments:        "Payments",
  revenue:         "Revenue",
  occupancy:       "Occupancy",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, idx) => ({
    label: ROUTE_LABELS[seg] ?? seg.replace(/-/g, " "),
    href:  "/" + segments.slice(0, idx + 1).join("/"),
    isLast: idx === segments.length - 1,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppHeader() {
  const user        = useAuthStore((s) => s.user);
  const { logout }  = useLogout();
  const breadcrumbs = useBreadcrumbs();

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.emp_id?.slice(0, 2).toUpperCase() ?? "SA";

  const roleLabel = user?.role
    ? user.role.replace(/_/g, " ").toUpperCase()
    : "SUPERADMIN";

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card text-card-foreground px-3 shadow-xs shrink-0 w-full z-30 transition-colors duration-200">
      {/* ── Sidebar trigger ────────────────────────────────────────── */}
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-5" />

      {/* ── Breadcrumbs ────────────────────────────────────────────── */}
      <Breadcrumb className="hidden sm:flex">
        <BreadcrumbList>
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {idx > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.isLast ? (
                  <BreadcrumbPage className="capitalize font-bold text-foreground">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={crumb.href}
                    className="capitalize text-muted-foreground hover:text-foreground text-xs font-medium"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

    

      <div className="flex-1" />

      {/* ── Right actions ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Search — desktop */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-2 text-muted-foreground text-xs px-3 h-8 rounded-md w-48 justify-start bg-background"
          aria-label="Search"
        >
          <SearchIcon className="size-3.5 text-muted-foreground" />
          <span>Search records…</span>
          <kbd className="ml-auto pointer-events-none hidden lg:inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1 text-[10px] font-bold text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8 text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <BellIcon className="size-4" />
          <span className="absolute top-1.5 right-1.5 flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-rose-600" />
          </span>
        </Button>

        <Separator orientation="vertical" className="h-5" />

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 h-9 px-2 rounded-md hover:bg-accent text-foreground"
                aria-label="User menu"
              />
            }
          >
            <Avatar className="size-7 border border-primary/30">
              <AvatarFallback className="text-xs font-extrabold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left leading-none pr-1">
              <span className="text-xs font-bold text-foreground">
                {user?.full_name || user?.emp_id || "Superadmin"}
              </span>
              <span className="text-[10px] font-extrabold text-primary mt-0.5">
                {roleLabel}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 mt-1 bg-popover text-popover-foreground border-border shadow-xl">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1 py-1">
                <span className="font-extrabold text-sm text-foreground">
                  {user?.full_name || user?.emp_id || "Superadmin"}
                </span>
                <span className="inline-flex w-fit items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-primary text-primary-foreground uppercase">
                  {roleLabel}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="text-xs font-medium text-foreground focus:bg-accent">
                <UserCircleIcon className="mr-2 size-4 text-muted-foreground" />
                Staff Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs font-medium text-foreground focus:bg-accent">
                <BellIcon className="mr-2 size-4 text-muted-foreground" />
                System Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-xs font-bold text-rose-500 focus:text-rose-500 focus:bg-rose-500/10"
              onClick={logout}
            >
              <LogOutIcon className="mr-2 size-4" />
              Sign Out Portal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
