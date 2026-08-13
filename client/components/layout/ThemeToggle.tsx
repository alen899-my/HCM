"use client";

// components/layout/ThemeToggle.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Dark Mode Toggle — Light, Pitch Dark, System theme switcher using next-themes
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-8">
        <SunIcon className="size-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 relative"
            aria-label="Toggle theme"
          />
        }
      >
        <SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-100" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer font-medium text-xs"
          onClick={() => setTheme("light")}
        >
          <SunIcon className="size-3.5 text-amber-500" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto text-rose-500 font-bold">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer font-medium text-xs"
          onClick={() => setTheme("dark")}
        >
          <MoonIcon className="size-3.5 text-indigo-400" />
          <span>Pitch Dark</span>
          {theme === "dark" && <span className="ml-auto text-rose-500 font-bold">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer font-medium text-xs"
          onClick={() => setTheme("system")}
        >
          <MonitorIcon className="size-3.5 text-slate-400" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto text-rose-500 font-bold">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
