// app/(dashboard)/dashboard/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Executive Hospital Overview Dashboard
// Displays key clinical statistics, active ER metrics, ward occupancy & activity
// Dynamic Theme Support (Light & Pitch Dark Mode)
// ─────────────────────────────────────────────────────────────────────────────

import {
  UsersIcon,
  StethoscopeIcon,
  BedDoubleIcon,
  ActivityIcon,
  HeartPulseIcon,
  TrendingUpIcon,
  ClockIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Inpatients",
    value: "1,284",
    change: "+12.5% this week",
    icon: <UsersIcon className="size-5 text-rose-500" />,
  },
  {
    title: "Active Doctors",
    value: "142",
    change: "38 on active duty",
    icon: <StethoscopeIcon className="size-5 text-blue-500" />,
  },
  {
    title: "Bed Occupancy",
    value: "86.4%",
    change: "412 / 480 Beds Occupied",
    icon: <BedDoubleIcon className="size-5 text-amber-500" />,
  },
  {
    title: "ER Admissions Today",
    value: "47",
    change: "Avg wait time: 14 mins",
    icon: <ActivityIcon className="size-5 text-emerald-500" />,
  },
];

const recentActivity = [
  { time: "09:42 AM", patient: "John Doe (EMP-8841)", event: "Admitted to ICU Ward B", status: "Critical" },
  { time: "09:15 AM", patient: "Sarah Smith (EMP-9204)", event: "Lab Test Completed - CBC Count", status: "Completed" },
  { time: "08:50 AM", patient: "Robert Chen (EMP-7712)", event: "Prescription Dispatched", status: "Dispatched" },
  { time: "08:30 AM", patient: "Maria Garcia (EMP-6390)", event: "Scheduled Cardiology Consultation", status: "Scheduled" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 bg-background">
      {/* ── Page Header Banner ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-card border border-border shadow-md transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <HeartPulseIcon className="size-6 text-rose-500" />
            Executive Hospital Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time clinical operations, patient admissions & department status.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <ClockIcon className="size-4" />
          <span>System Status: OPERATIONAL</span>
        </div>
      </div>

      {/* ── Metric Cards Grid ────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border shadow-md hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                <TrendingUpIcon className="size-3 text-emerald-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Lower Panels ────────────────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Recent Admissions & Activity */}
        <Card className="md:col-span-4 bg-card border-border shadow-md transition-colors">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">
              Recent Clinical Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">{act.patient}</span>
                  <span className="text-xs text-muted-foreground">{act.event}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-rose-500 block">{act.status}</span>
                  <span className="text-[10px] text-muted-foreground">{act.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Operations Panel */}
        <Card className="md:col-span-3 bg-card border-border shadow-md transition-colors">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">
              Emergency & Department Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Emergency Room (ER)", status: "Active - 8 Beds Available", color: "bg-emerald-500" },
              { label: "Intensive Care Unit (ICU)", status: "High Occupancy - 2 Beds Left", color: "bg-amber-500" },
              { label: "Operation Theatre (OT)", status: "3 Surgeries in Progress", color: "bg-rose-500" },
              { label: "Central Diagnostic Lab", status: "Processing Queue: 12 Samples", color: "bg-blue-500" },
            ].map((dep, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/50">
                <span className="text-xs font-bold text-foreground">{dep.label}</span>
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${dep.color}`} />
                  {dep.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
