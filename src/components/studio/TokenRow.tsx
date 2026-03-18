"use client";

import * as React from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { Token } from "@/lib/tokens/schema";
import { useThemeStore } from "@/store/themeStore";
import { DEFAULT_TOKENS } from "@/lib/tokens/defaults";
import { PRESETS } from "@/lib/tokens/presets";
import { ColorTokenEditor } from "./ColorTokenEditor";
import { ScalarTokenEditor } from "./ScalarTokenEditor";
import { ShadowTokenEditor } from "./ShadowTokenEditor";
import { TypographyTokenEditor } from "./TypographyTokenEditor";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TokenRowProps {
  token: Token;
  activeMode: "light" | "dark";
  isCustom?: boolean;
}

export function TokenRow({ token, activeMode, isCustom = false }: TokenRowProps) {
  const storeValue = useThemeStore((state) => state.tokens[activeMode]?.[token.cssVar]);
  const activePreset = useThemeStore((state) => state.activePreset);
  const setToken = useThemeStore((state) => state.setToken);
  const resetToken = useThemeStore((state) => state.resetToken);
  const removeCustomToken = useThemeStore((state) => state.removeCustomToken);

  // Resolve baseline from the active preset, falling back to DEFAULT_TOKENS
  const baselinePreset = activePreset ? PRESETS.find((p) => p.id === activePreset) : null;
  const baselineValue = baselinePreset
    ? baselinePreset.tokens[activeMode][token.cssVar]
    : DEFAULT_TOKENS[activeMode][token.cssVar];
  const value = storeValue ?? baselineValue ?? "";
  
  const isModified = storeValue !== undefined && JSON.stringify(storeValue) !== JSON.stringify(baselineValue);

  const handleChange = React.useCallback(
    (newValue: string | { h: number; s: number; l: number; a?: number }) => {
      setToken(activeMode, token.cssVar, newValue);
    },
    [activeMode, token.cssVar, setToken]
  );

  const renderEditor = () => {
    if (token.type === "color") {
      return <ColorTokenEditor token={token} value={value as { h: number; s: number; l: number; a?: number }} onChange={handleChange as (v: { h: number; s: number; l: number; a?: number }) => void} />;
    }
    if (token.type === "radius" || token.type === "spacing" || token.type === "fontSize") {
      return <ScalarTokenEditor token={token} value={value as string} onChange={handleChange as (v: string) => void} />;
    }
    if (token.type === "shadow") {
      return <ShadowTokenEditor token={token} value={value as string} onChange={handleChange as (v: string) => void} />;
    }
    if (token.group === "typography" && (token.type === "fontFamily" || token.type === "fontWeight" || token.type === "lineHeight")) {
      return <TypographyTokenEditor token={token} value={value as string} onChange={handleChange as (v: string) => void} />;
    }

    // Fallback: inline text input for custom or unmapped types
    return (
      <Input
        value={value as string}
        onChange={(e) => handleChange(e.target.value)}
        className="h-7 w-32 text-xs font-mono bg-card border-border focus-visible:ring-1 focus-visible:ring-ring"
      />
    );
  };

  return (
    <div className="group flex items-center min-h-[36px] px-2 py-1 gap-3 hover:bg-accent hover:text-accent-foreground transition-colors">
      <div className="w-1.5 shrink-0 flex items-center justify-center">
        {isModified && (
          <TooltipProvider delay={400}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    className="w-3 h-3 rounded-full bg-amber-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:ring-offset-1"
                    aria-label="Token modified — click reset to restore default"
                  />
                }
              />
              <TooltipContent side="right" className="text-xs bg-popover text-foreground border-input">
                Modified — click reset to restore
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="flex flex-col min-w-0 flex-1 justify-center leading-tight">
        <span className="text-sm text-foreground truncate pr-2">
          {token.type === "fontFamily" ? token.cssVar.replace("--font-", "") : (token.description || token.cssVar)}
        </span>
        <span className="text-xs text-muted-foreground font-mono hidden sm:inline-block truncate">
          {token.cssVar}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2 shrink-0">
        {renderEditor()}
        
        <div className="w-6 shrink-0 flex justify-end">
          {isModified && !isCustom && (
            <TooltipProvider delay={400}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => resetToken(token.cssVar)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-accent-foreground transition-all rounded hover:bg-accent hover:text-accent-foreground"
                      aria-label="Reset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  }
                />
                <TooltipContent side="left" className="text-xs bg-popover text-foreground border-input">
                  Reset
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {isCustom && (
            <TooltipProvider delay={400}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => removeCustomToken((token as any).id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-400 transition-all rounded hover:bg-accent hover:text-accent-foreground"
                      aria-label="Delete custom token"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  }
                />
                <TooltipContent side="left" className="text-xs bg-popover text-foreground border-input">
                  Delete custom token
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
