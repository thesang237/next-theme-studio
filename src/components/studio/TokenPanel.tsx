"use client";

import * as React from "react";
import { useShallow } from "zustand/react/shallow";
import { ModeToggle } from "./ModeToggle";
import { useThemeStore } from "@/store/themeStore";
import { TOKEN_GROUPS } from "@/lib/tokens/groups";
import { DEFAULT_TOKENS } from "@/lib/tokens/defaults";
import { PRESETS } from "@/lib/tokens/presets";
import { TokenGroup } from "./TokenGroup";
import { PrimitivesPanel } from "./PrimitivesPanel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";

type PanelTab = "tokens" | "primitives";

export function TokenPanel() {
  const [activeTab, setActiveTab] = React.useState<PanelTab>("tokens");

  const { tokens, customTokens, activeMode, activePreset, resetAll } = useThemeStore(
    useShallow((state) => ({
      tokens: state.tokens,
      customTokens: state.customTokens,
      activeMode: state.activeMode,
      activePreset: state.activePreset,
      resetAll: state.resetAll,
    }))
  );

  const [isResetOpen, setIsResetOpen] = React.useState(false);

  // Calculate modified count — compare against the active preset's baseline, or DEFAULT_TOKENS if none
  const modifiedCount = React.useMemo(() => {
    const baselinePreset = activePreset ? PRESETS.find((p) => p.id === activePreset) : null;
    const baselineTokens = baselinePreset ? baselinePreset.tokens[activeMode] : DEFAULT_TOKENS[activeMode];
    let count = 0;
    Object.keys(baselineTokens).forEach((key) => {
      const currentVal = tokens[activeMode][key];
      const baseVal = baselineTokens[key];
      if (currentVal !== undefined && JSON.stringify(currentVal) !== JSON.stringify(baseVal)) {
        count++;
      }
    });
    return count;
  }, [tokens, activeMode, activePreset]);

  const totalTokens = React.useMemo(() => {
    return TOKEN_GROUPS.reduce((acc, group) => acc + group.tokens.length, 0);
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0 bg-background border-l border-border w-full md:w-[380px] shrink-0">
      {/* Tab bar */}
      <header className="sticky top-0 z-10 shrink-0 bg-background backdrop-blur border-b border-border">
        <div className="flex items-center h-10 px-2 gap-1 border-b border-border">
          <button
            onClick={() => setActiveTab("tokens")}
            className={`flex-1 h-7 rounded text-xs font-medium transition ${
              activeTab === "tokens"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            Tokens
          </button>
          <button
            onClick={() => setActiveTab("primitives")}
            className={`flex-1 h-7 rounded text-xs font-medium transition ${
              activeTab === "primitives"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            Primitives
          </button>
        </div>

        {/* Tokens tab controls */}
        {activeTab === "tokens" && (
          <div className="flex items-center justify-between h-10 px-4">
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
          </div>
        )}
      </header>

      {activeTab === "tokens" ? (
        <>
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
          <footer className="sticky bottom-0 z-10 flex items-center justify-between h-8 px-4 shrink-0 bg-background border-t border-border shadow-[0_-8px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_16px_rgba(0,0,0,0.4)]">
            <span className="text-[10px] text-muted-foreground font-mono tracking-wide uppercase">
              {totalTokens} tokens
            </span>
            {customTokens.length > 0 && (
              <span className="text-[10px] text-muted-foreground font-mono tracking-wide uppercase">
                · {customTokens.length} custom
              </span>
            )}
          </footer>
        </>
      ) : (
        <PrimitivesPanel />
      )}
    </div>
  );
}
