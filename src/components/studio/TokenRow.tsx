"use client";

import * as React from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { Token } from "@/lib/tokens/schema";
import { useThemeStore } from "@/store/themeStore";
import { DEFAULT_TOKENS } from "@/lib/tokens/defaults";
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
  const setToken = useThemeStore((state) => state.setToken);
  const resetToken = useThemeStore((state) => state.resetToken);
  const removeCustomToken = useThemeStore((state) => state.removeCustomToken);

  // Fallback to default if not in store (e.g. initial load before sync)
  const defaultValue = DEFAULT_TOKENS[activeMode][token.cssVar];
  const value = storeValue ?? defaultValue ?? "";
  
  const isModified = storeValue !== undefined && JSON.stringify(storeValue) !== JSON.stringify(defaultValue);

  const handleChange = (newValue: string | { h: number; s: number; l: number; a?: number }) => {
    setToken(activeMode, token.cssVar, newValue);
  };

  const renderEditor = () => {
    if (token.type === "color") {
      // @ts-ignore - we know it's HSLValue
      return <ColorTokenEditor token={token} value={value} onChange={handleChange} />;
    }
    if (token.type === "radius" || token.type === "spacing" || token.type === "fontSize") {
      return <ScalarTokenEditor token={token} value={value as string} onChange={handleChange as any} />;
    }
    if (token.type === "shadow") {
      return <ShadowTokenEditor token={token} value={value as string} onChange={handleChange as any} />;
    }
    if (token.group === "typography" && (token.type === "fontFamily" || token.type === "fontWeight" || token.type === "lineHeight")) {
      return <TypographyTokenEditor token={token} value={value as string} onChange={handleChange as any} />;
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
                render={<div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              />
              <TooltipContent side="right" className="text-xs bg-popover text-foreground border-input">
                Modified — click reset to restore default
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
                      aria-label="Reset to default"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  }
                />
                <TooltipContent side="left" className="text-xs bg-popover text-foreground border-input">
                  Reset to default
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
