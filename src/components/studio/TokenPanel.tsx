"use client";

import * as React from "react";
import { ModeToggle } from "./ModeToggle";
import { useThemeStore } from "@/store/themeStore";
import { TOKEN_GROUPS } from "@/lib/tokens/groups";
import { DEFAULT_TOKENS } from "@/lib/tokens/defaults";
import { TokenGroup } from "./TokenGroup";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";

export function TokenPanel() {
  const tokens = useThemeStore((state) => state.tokens);
  const customTokens = useThemeStore((state) => state.customTokens);
  const activeMode = useThemeStore((state) => state.activeMode);
  const resetAll = useThemeStore((state) => state.resetAll);

  const [isResetOpen, setIsResetOpen] = React.useState(false);

  // Calculate modified count
  const modifiedCount = React.useMemo(() => {
    let count = 0;
    const allDefs = Object.keys(DEFAULT_TOKENS[activeMode]);
    allDefs.forEach((key) => {
      const currentVal = tokens[activeMode][key];
      const defaultVal = DEFAULT_TOKENS[activeMode][key];
      if (currentVal !== undefined && JSON.stringify(currentVal) !== JSON.stringify(defaultVal)) {
        count++;
      }
    });
    return count;
  }, [tokens, activeMode]);

  const totalTokens = React.useMemo(() => {
    return TOKEN_GROUPS.reduce((acc, group) => acc + group.tokens.length, 0);
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0 bg-background border-l border-border w-full md:w-[380px] shrink-0">
      <header className="sticky top-0 z-10 flex items-center justify-between h-12 px-4 shrink-0 bg-background backdrop-blur border-b border-border">
        <ModeToggle />
        
        <div className="flex items-center gap-3">
          {modifiedCount > 0 && (
            <span className="text-xs font-medium text-amber-400 font-mono bg-amber-400/10 px-1.5 py-0.5 rounded">
              {modifiedCount} modified
            </span>
          )}
          
          <Popover open={isResetOpen} onOpenChange={setIsResetOpen}>
            <PopoverTrigger render={<button className="text-xs text-muted-foreground hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded px-1.5 py-1">
                Reset All
              </button>}>
            </PopoverTrigger>
            <PopoverContent className="w-60 bg-background border-border p-4 shadow-xl" align="end">
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  Reset all tokens?
                </div>
                <p className="text-muted-foreground text-xs">
                  This will restore all light and dark tokens to their shadcn/ui defaults and remove all custom tokens.
                </p>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setIsResetOpen(false)}
                    className="px-3 py-1.5 rounded bg-popover text-foreground text-xs hover:bg-accent hover:text-accent-foreground transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      resetAll();
                      setIsResetOpen(false);
                    }}
                    className="px-3 py-1.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 text-xs hover:bg-red-500/20 transition"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <ScrollArea className="flex-1 min-h-0 w-full">
        <div className="pb-12">
          {TOKEN_GROUPS.map((group) => (
            <TokenGroup
              key={group.id}
              group={group}
              customTokens={group.id === "custom" ? customTokens : undefined}
              activeMode={activeMode}
            />
          ))}
        </div>
      </ScrollArea>

      <footer className="sticky bottom-0 z-10 flex items-center justify-between h-8 px-4 shrink-0 bg-background border-t border-border shadow-[0_-8px_16px_rgba(0,0,0,0.4)]">
        <span className="text-[10px] text-muted-foreground font-mono tracking-wide uppercase">
          {totalTokens} tokens
        </span>
        {customTokens.length > 0 && (
          <span className="text-[10px] text-muted-foreground font-mono tracking-wide uppercase">
            · {customTokens.length} custom
          </span>
        )}
      </footer>
    </div>
  );
}
