"use client";

import * as React from "react";
import { Check, Upload } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { PRESETS } from "@/lib/tokens/presets";
import { hslToCssString } from "@/lib/colorUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Preset } from "@/lib/tokens/schema";

export function PresetPicker() {
  const activePresetId = useThemeStore((state) => state.activePreset);
  const activeMode = useThemeStore((state) => state.activeMode);
  const currentTokens = useThemeStore((state) => state.tokens);
  const applyPreset = useThemeStore((state) => state.applyPreset);
  const importTokens = useThemeStore((state) => state.importTokens);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        importTokens(jsonStr);
        toast.success("Theme imported successfully!");
      } catch (err: any) {
        toast.error(`Invalid JSON: ${err.message}`);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
    };
    reader.readAsText(file);
  };

  const isModified = React.useCallback(
    (preset: Preset) => {
      if (activePresetId !== preset.id) return false;
      const presetTokens = preset.tokens[activeMode];
      const stateTokens = currentTokens[activeMode];
      return Object.keys(presetTokens).some(
        (key) => JSON.stringify(presetTokens[key]) !== JSON.stringify(stateTokens[key])
      );
    },
    [activePresetId, activeMode, currentTokens]
  );

  const swatchKeys = ["--primary", "--secondary", "--accent", "--destructive", "--muted"];

  return (
    <div className="flex flex-col h-full bg-background border-r border-border w-full md:w-[220px] shrink-0">
      <header className="sticky top-0 z-10 flex items-center h-12 px-4 shrink-0 bg-background backdrop-blur border-b border-border">
        <span className="text-sm font-medium text-foreground">Presets</span>
      </header>

      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col py-2">
          {PRESETS.map((preset: Preset) => {
            const isActive = activePresetId === preset.id;
            const modified = isModified(preset);

            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`group flex items-center h-[52px] px-4 gap-3 transition-colors text-left focus-visible:outline-none focus-visible:bg-card ${
                  isActive ? "bg-card/50" : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {/* Swatch strip */}
                <div className="flex -space-x-1 shrink-0">
                  {swatchKeys.map((key) => {
                    const val = preset.tokens[activeMode][key];
                    if (!val) return null;
                    // Assume HSL strings since defaults hold HSL objects or string? Wait, it's HSLState
                    // The tokens are HSLObjects for colors.
                    return (
                      <div
                        key={key}
                        className="w-3.5 h-3.5 rounded-full border border-zinc-950 shadow-sm"
                        style={{
                          backgroundColor:
                            typeof val === "object" && "h" in val
                              ? `hsl(${hslToCssString(val as any)})`
                              : (val as string),
                        }}
                      />
                    );
                  })}
                </div>

                <div className="flex flex-col flex-1 min-w-0 justify-center">
                  <span className={`text-sm truncate transition-colors ${isActive ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {preset.name}
                  </span>
                  {isActive && modified && (
                    <span className="text-[10px] text-amber-400 font-medium leading-none mt-0.5">
                      Modified
                    </span>
                  )}
                </div>

                {isActive && (
                  <Check className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <footer className="sticky bottom-0 z-10 p-3 shrink-0 bg-background border-t border-border shadow-[0_-8px_16px_rgba(0,0,0,0.4)]">
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleImport}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center w-full h-8 gap-2 rounded bg-card text-foreground text-xs font-medium hover:bg-accent hover:text-accent-foreground hover:text-white transition-colors border border-border"
        >
          <Upload className="w-3.5 h-3.5" />
          Import JSON
        </button>
      </footer>
    </div>
  );
}
