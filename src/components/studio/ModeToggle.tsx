"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useTheme as useNextTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const activeMode = useThemeStore((state) => state.activeMode);
  const setActiveMode = useThemeStore((state) => state.setActiveMode);
  const { setTheme } = useNextTheme();
  
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleModeChange = (mode: "light" | "dark") => {
    setActiveMode(mode);
    setTheme(mode);
  };

  if (!mounted) return null;

  return (
    <div className="relative inline-flex items-center h-7 p-0.5 rounded-md bg-card border border-border w-fit text-xs font-medium focus-visible:ring-1 focus-visible:ring-ring">
      {/* Sliding background */}
      <div
        className={cn(
          "pointer-events-none absolute left-0.5 top-0.5 bottom-0.5 w-[calc(50%-0.125rem)] rounded bg-white shadow-sm transition-transform duration-150 ease-out dark:bg-zinc-800",
          activeMode === "dark" ? "translate-x-full" : "translate-x-0"
        )}
      />
      
      <button
        type="button"
        onClick={() => handleModeChange("light")}
        className={cn(
          "relative z-10 flex items-center justify-center w-16 h-full gap-1.5 rounded transition-colors duration-150",
          activeMode === "light" ? "text-primary dark:text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className="w-3.5 h-3.5" />
        Light
      </button>

      <button
        type="button"
        onClick={() => handleModeChange("dark")}
        className={cn(
          "relative z-10 flex items-center justify-center w-16 h-full gap-1.5 rounded transition-colors duration-150",
          activeMode === "dark" ? "text-primary dark:text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="w-3.5 h-3.5" />
        Dark
      </button>
    </div>
  );
}
