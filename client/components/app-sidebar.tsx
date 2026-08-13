"use client";

// components/app-sidebar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Hospital Management System — Responsive Enterprise Sidebar
// Reacts dynamically to Light Mode (white) and Pitch Dark Mode (#000000)
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";
import {
  ActivityIcon,
  BedDoubleIcon,
  CalendarDaysIcon,
  FlaskConicalIcon,
  HeartPulseIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  PillIcon,
  ReceiptTextIcon,
  SettingsIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
  UsersRoundIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/features/auth/store";
import { ROUTES } from "@/lib/constants";

// ─── Navigation config ────────────────────────────────────────────────────────

const navMain = [
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Patients",
    url: ROUTES.PATIENTS,
    icon: <UsersRoundIcon />,
    items: [
      { title: "All Patients", url: ROUTES.PATIENTS },
      { title: "Register Patient", url: `${ROUTES.PATIENTS}/new` },
    ],
  },
  {
    title: "Doctors",
    url: ROUTES.DOCTORS,
    icon: <StethoscopeIcon />,
    items: [
      { title: "All Doctors", url: ROUTES.DOCTORS },
      { title: "Specializations", url: `${ROUTES.DOCTORS}/specializations` },
    ],
  },
  {
    title: "Appointments",
    url: ROUTES.APPOINTMENTS,
    icon: <CalendarDaysIcon />,
    items: [
      { title: "Schedule", url: ROUTES.APPOINTMENTS },
      { title: "New Appointment", url: `${ROUTES.APPOINTMENTS}/new` },
    ],
  },
  {
    title: "Wards & Beds",
    url: ROUTES.WARDS,
    icon: <BedDoubleIcon />,
    items: [
      { title: "Ward Overview", url: ROUTES.WARDS },
      { title: "Admissions", url: `${ROUTES.WARDS}/admissions` },
    ],
  },
  {
    title: "Pharmacy",
    url: ROUTES.PHARMACY,
    icon: <PillIcon />,
    items: [
      { title: "Medicines", url: `${ROUTES.PHARMACY}/medicines` },
      { title: "Prescriptions", url: `${ROUTES.PHARMACY}/prescriptions` },
    ],
  },
  {
    title: "Laboratory",
    url: ROUTES.LABORATORY,
    icon: <FlaskConicalIcon />,
    items: [
      { title: "Test Orders", url: ROUTES.LABORATORY },
      { title: "Results", url: `${ROUTES.LABORATORY}/results` },
    ],
  },
  {
    title: "Billing",
    url: ROUTES.BILLING,
    icon: <ReceiptTextIcon />,
    items: [
      { title: "Invoices", url: ROUTES.BILLING },
      { title: "Payments", url: `${ROUTES.BILLING}/payments` },
    ],
  },
  {
    title: "Reports",
    url: ROUTES.REPORTS,
    icon: <ActivityIcon />,
    items: [
      { title: "Dashboard", url: ROUTES.REPORTS },
      { title: "Revenue", url: `${ROUTES.REPORTS}/revenue` },
      { title: "Occupancy", url: `${ROUTES.REPORTS}/occupancy` },
    ],
  },
  {
    title: "Roles & Permissions",
    url: ROUTES.RESOURCES,
    icon: <ShieldCheckIcon />,
    items: [
      { title: "Resources", url: ROUTES.RESOURCES },
      { title: "Roles", url: ROUTES.ROLES },
      { title: "Permissions", url: ROUTES.PERMISSIONS },
    ],
  },
];

const navSecondary = [
  {
    title: "Settings",
    url: "/settings",
    icon: <SettingsIcon />,
  },
  {
    title: "Support",
    url: "/support",
    icon: <LifeBuoyIcon />,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((s) => s.user);

  const navUser = {
    name: user?.full_name ?? user?.emp_id ?? "Superadmin",
    email: user?.role
      ? user.role.replace(/_/g, " ").toUpperCase()
      : "STAFF",
    avatar: "",
  };

  return (
    <Sidebar
      variant="sidebar"
      className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xs transition-colors duration-200"
      {...props}
    >
      {/* ── Brand Header — Hospital Badge ───────────────────────────────────── */}
      <SidebarHeader className="border-b border-sidebar-border p-3 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href={ROUTES.DASHBOARD} />}>
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <HeartPulseIcon className="size-5" />
              </div>
              <div className="grid flex-1 text-left leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sidebar-foreground text-base tracking-wide">
                    HSM CARE
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black bg-primary text-primary-foreground uppercase tracking-wider">
                    EMR
                  </span>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground mt-1">
                  Hospital Management System
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Main navigation ─────────────────────────────────────────── */}
      <SidebarContent className="bg-sidebar">
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto border-t border-sidebar-border" />
      </SidebarContent>

      {/* ── Footer — user profile ────────────────────────────────────── */}
      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-2">
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
