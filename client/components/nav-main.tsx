"use client";

import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  url: string;
  icon: React.ReactNode;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2">
        Hospital Modules
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1 px-1">
        {items.map((item) => {
          // Check if item or any of its sub-items matches current pathname
          const isItemActive =
            pathname === item.url ||
            (item.url !== "#" && item.url !== "/dashboard" && pathname.startsWith(item.url)) ||
            item.items?.some((sub) => pathname === sub.url);

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isItemActive || item.isActive}
              render={<SidebarMenuItem />}
            >
              {/* ── Main Menu Item (High Contrast Light / Dark Mode) ── */}
              <SidebarMenuButton
                tooltip={item.title}
                render={<a href={item.url} />}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all duration-150",
                  isItemActive
                    ? "bg-rose-600 text-white font-extrabold shadow-md border-l-4 border-slate-900 dark:border-white hover:bg-rose-600 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-200 dark:hover:bg-[#121212] dark:hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "size-4 shrink-0 transition-transform",
                    isItemActive
                      ? "text-white scale-110"
                      : "text-slate-500 dark:text-zinc-400"
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.title}</span>
              </SidebarMenuButton>

              {/* ── Sub-menu Items ── */}
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuAction className="aria-expanded:rotate-90 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-[#121212]" />
                    }
                  >
                    <ChevronRightIcon className="size-4" />
                    <span className="sr-only">Toggle</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-3 my-1 border-l-2 border-slate-200 dark:border-[#1F1F1F] pl-2 space-y-1">
                      {item.items.map((subItem) => {
                        const isSubActive = pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              render={<a href={subItem.url} />}
                              className={cn(
                                "flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors font-medium",
                                isSubActive
                                  ? "bg-rose-600 text-white font-extrabold border-l-2 border-slate-900 dark:border-white pl-3 shadow-xs"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-[#121212]"
                              )}
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
