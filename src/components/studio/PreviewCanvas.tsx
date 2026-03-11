"use client";

import * as React from "react";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function PreviewCanvas() {
  const activeMode = useThemeStore((state) => state.activeMode);
  const [zoom, setZoom] = React.useState(1);

  return (
    <div className="flex flex-col h-full bg-background flex-1 relative min-w-0">
      <header className="sticky top-0 z-20 flex items-center justify-between h-10 px-4 shrink-0 border-b border-border bg-background backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Preview</span>
          <span className="text-[10px] uppercase font-mono bg-popover text-muted-foreground px-1.5 py-0.5 rounded leading-none">
            {activeMode}
          </span>
        </div>

        <div className="flex items-center bg-card border border-border rounded">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="w-10 text-center text-xs font-mono text-foreground">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3 bg-muted mx-1" />
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            title="Reset Zoom"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Background matches standard shadcn bg. 
          Use a subtle dot grid behind the preview container. */}
      <ScrollArea className="flex-1 min-h-0 w-full bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]">
        <div 
          className="flex items-start justify-center p-8 min-h-full"
        >
          {/* Main preview body scaled by zoom */}
          <div
            id="theme-preview"
            className={cn("w-full max-w-4xl min-h-[500px] p-8 md:p-12 mb-12 shadow-2xl rounded-xl border border-input dark:border-border bg-background text-foreground transition-all duration-200", activeMode === "dark" ? "dark" : "")}
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          >
            <div className="grid gap-12">
              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Buttons</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Inputs</h3>
                <div className="grid max-w-sm gap-4">
                  <Input placeholder="Email address" />
                  <Textarea placeholder="Message..." rows={3} />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember">Remember me</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifications" />
                    <Label htmlFor="notifications">Email notifications</Label>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Cards</h3>
                <Card className="max-w-md">
                  <CardHeader>
                    <CardTitle>Project Settings</CardTitle>
                    <CardDescription>Configure your project and manage access control settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">This is a paragraph inside the card content. It should use your configured typography scale and primary text colors.</p>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save changes</Button>
                  </CardFooter>
                </Card>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Badges</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Alerts</h3>
                <div className="grid max-w-md gap-4">
                  <Alert>
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>Your payment has been successfully processed.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>There was a problem processing your request. Please try again.</AlertDescription>
                  </Alert>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Typography</h3>
                <div className="space-y-6">
                  <div>
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                      Heading One
                    </h1>
                  </div>
                  <div>
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                      Heading Two
                    </h2>
                  </div>
                  <div>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      Body paragraph text spanning multiple lines to show off line height. It provides a visual representation of the font family, font size, and spacing tokens configured.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Muted text for secondary information and captions.
                    </p>
                  </div>
                  <div>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      inline code sample
                    </code>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
