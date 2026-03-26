"use client";

import * as React from "react";
import { Download, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsIndicator, TabsContent } from "@/components/ui/tabs";
import { useThemeStore } from "@/store/themeStore";
import { exportToFigma } from "@/lib/export/toFigma";
import { exportToCss } from "@/lib/export/toCss";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";

hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);

interface ExportModalProps {
  children: React.ReactNode;
}

export function ExportModal({ children }: ExportModalProps) {
  const tokens = useThemeStore((state) => state.tokens);
  const customTokens = useThemeStore((state) => state.customTokens);

  const [copiedTab, setCopiedTab] = React.useState<string | null>(null);

  const figmaCode = React.useMemo(() => exportToFigma(tokens, customTokens), [tokens, customTokens]);
  const cssCode = React.useMemo(() => exportToCss(tokens, customTokens), [tokens, customTokens]);

  const handleCopy = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 1500);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  const handleDownload = async (format: "figma" | "css") => {
    const filename = format === "css" ? "theme-studio.css" : "theme-studio.json";

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, tokens, customTokens }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.warn("API export failed, falling back to local download.");
      const content = format === "figma" ? figmaCode : cssCode;
      const blob = new Blob([content], { type: format === "css" ? "text/css" : "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  return (
    <Dialog>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[800px] bg-background border-border text-foreground p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-2 border-b border-border">
          <DialogTitle className="text-lg font-medium">Export Theme</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="css" className="flex flex-col w-full h-[450px]">
          <div className="px-6 pt-2 border-b border-border bg-background">
            <TabsList className="w-full justify-start rounded-md h-9 p-0.5">
              <TabsTrigger value="css" className="text-xs h-full rounded-sm flex-1">CSS</TabsTrigger>
              <TabsTrigger value="figma" className="text-xs h-full rounded-sm flex-1">Figma Variables</TabsTrigger>
              <TabsIndicator />
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden bg-background">
            {/* Figma Tab */}
            <TabsContent value="figma" className="h-full flex flex-col m-0 outline-none data-[hidden]:hidden">
              <div className="px-6 py-3 border-b border-border shrink-0">
                <p className="text-xs text-muted-foreground leading-snug">
                  Import using the 'Figma Variables Importer' community plugin. Open the plugin → Import JSON → paste or upload this file.
                </p>
              </div>
              <div className="flex-1 overflow-auto bg-background p-6 overscroll-contain">
                <pre className="text-[11px] leading-relaxed font-mono">
                  <code dangerouslySetInnerHTML={{ __html: hljs.highlight(figmaCode, { language: 'json' }).value }} />
                </pre>
              </div>
              <div className="h-14 px-6 border-t border-border bg-background shrink-0 gap-3 flex items-center justify-end">
                <button onClick={() => handleCopy(figmaCode, "figma")} className="flex items-center gap-2 h-8 px-3 text-xs bg-card text-foreground hover:bg-accent hover:text-accent-foreground border border-border rounded transition">
                  {copiedTab === "figma" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedTab === "figma" ? "Copied!" : "Copy to clipboard"}
                </button>
                <button onClick={() => handleDownload("figma")} className="flex items-center gap-2 h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded transition">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </TabsContent>

            {/* CSS Tab */}
            <TabsContent value="css" className="h-full flex flex-col m-0 outline-none data-[hidden]:hidden">
              <div className="px-6 py-3 border-b border-border shrink-0">
                <p className="text-xs text-muted-foreground leading-snug">
                  Copy this into your <code className="text-foreground">globals.css</code>, replacing your existing <code className="text-foreground">:root</code> and <code className="text-foreground">.dark</code> variable blocks.
                </p>
              </div>
              <div className="flex-1 overflow-auto bg-background p-6 overscroll-contain">
                <pre className="text-[11px] leading-relaxed font-mono">
                  <code dangerouslySetInnerHTML={{ __html: hljs.highlight(cssCode, { language: 'css' }).value }} />
                </pre>
              </div>
              <div className="h-14 px-6 border-t border-border bg-background shrink-0 gap-3 flex items-center justify-end">
                <button onClick={() => handleCopy(cssCode, "css")} className="flex items-center gap-2 h-8 px-3 text-xs bg-card text-foreground hover:bg-accent hover:text-accent-foreground border border-border rounded transition">
                  {copiedTab === "css" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedTab === "css" ? "Copied!" : "Copy to clipboard"}
                </button>
                <button onClick={() => handleDownload("css")} className="flex items-center gap-2 h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded transition">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
