"use client";

import * as React from "react";
import { useThemeStore } from "@/store/themeStore";
import { Undo2, Redo2, Download } from "lucide-react";
import { createInjector } from "@/lib/cssInjector";
import { PresetPicker } from "./PresetPicker";
import { PreviewCanvas } from "./PreviewCanvas";
import { TokenPanel } from "./TokenPanel";
import { ExportModal } from "./ExportModal";
import { shallow } from "zustand/shallow";
import { Button } from "@/components/ui/button";
import { useTheme as useNextTheme } from "next-themes";

export function StudioShell() {
  const canUndo = useThemeStore((state) => state.canUndo);
  const canRedo = useThemeStore((state) => state.canRedo);
  const undo = useThemeStore((state) => state.undo);
  const redo = useThemeStore((state) => state.redo);

  const [mobileTab, setMobileTab] = React.useState<"presets" | "preview" | "tokens">("preview");

  const { setTheme } = useNextTheme();
  const injector = React.useMemo(() => createInjector(), []);

  React.useEffect(() => {
    // Fire immediately on mount
    const { tokens, customTokens, activeMode } = useThemeStore.getState();
    injector(tokens, customTokens, activeMode);
    setTheme(activeMode);

    // Subscribe to token AND mode changes
    const unsub = useThemeStore.subscribe((state, prev) => {
      if (
        !shallow(state.tokens, prev.tokens) ||
        !shallow(state.customTokens, prev.customTokens) ||
        state.activeMode !== prev.activeMode
      ) {
        injector(state.tokens, state.customTokens, state.activeMode);
        setTheme(state.activeMode);
      }
    });
    return () => unsub();
  }, [injector]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if targeting an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          if (canRedo) redo();
        } else {
          e.preventDefault();
          if (canUndo) undo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between h-12 px-4 border-b border-border bg-background shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center bg-muted rounded-sm">
            <div className="w-2.5 h-2.5 bg-background rotate-45" />
          </div>
          <span className="font-medium text-white tracking-wide">Theme Studio</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-card border border-border rounded">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 text-muted-foreground hover:text-white disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors"
              title="Undo (Cmd+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-popover" />
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 text-muted-foreground hover:text-white disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors"
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-[1px] h-5 bg-popover mx-2" />

          <ExportModal>
            <Button size="sm" variant="outline" className="h-8 gap-2 bg-card border-input hover:bg-accent hover:text-accent-foreground hover:text-white text-xs">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </ExportModal>
        </div>
      </header>

      {/* Main Content Area - Desktop (3-col) */}
      <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        <PresetPicker />
        <PreviewCanvas />
        <TokenPanel />
      </div>

      {/* Main Content Area - Mobile */}
      <div className="flex flex-col flex-1 min-h-0 md:hidden overflow-hidden">
        <div className="flex-1 overflow-hidden relative">
          <div className={`absolute inset-0 ${mobileTab === "presets" ? "block" : "hidden"}`}>
            <PresetPicker />
          </div>
          <div className={`absolute inset-0 flex flex-col ${mobileTab === "preview" ? "block" : "hidden"}`}>
            <PreviewCanvas />
          </div>
          <div className={`absolute inset-0 flex justify-center ${mobileTab === "tokens" ? "block" : "hidden"}`}>
            <TokenPanel />
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex items-center h-14 bg-background border-t border-border shrink-0">
          <button
            onClick={() => setMobileTab("presets")}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors ${
              mobileTab === "presets" ? "text-white" : "text-muted-foreground hover:text-accent-foreground"
            }`}
          >
            <div className="text-xs font-medium">Presets</div>
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors ${
              mobileTab === "preview" ? "text-white" : "text-muted-foreground hover:text-accent-foreground"
            }`}
          >
            <div className="text-xs font-medium">Preview</div>
          </button>
          <button
            onClick={() => setMobileTab("tokens")}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors ${
              mobileTab === "tokens" ? "text-white" : "text-muted-foreground hover:text-accent-foreground"
            }`}
          >
            <div className="text-xs font-medium">Tokens</div>
          </button>
        </div>
      </div>
    </div>
  );
}
