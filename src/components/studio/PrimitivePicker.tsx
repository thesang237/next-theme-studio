"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPrimitivesForTokenType, primitiveToRem } from "@/lib/tokens/tailwindPrimitives";
import type { TokenType } from "@/lib/tokens/schema";

interface PrimitivePickerProps {
  tokenType: TokenType;
  onSelect: (value: string) => void;
}

export function PrimitivePicker({ tokenType, onSelect }: PrimitivePickerProps) {
  const primitives = getPrimitivesForTokenType(tokenType);
  const [open, setOpen] = React.useState(false);

  if (primitives.length === 0) return null;

  const label = tokenType === "radius" ? "Border Radius" : "Spacing";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            title="Pick from Tailwind primitives"
            className="flex items-center justify-center h-7 px-1.5 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:border-muted-foreground font-mono text-[10px] leading-none shrink-0 transition"
          >
            TW
          </button>
        }
      />
      <PopoverContent
        className="w-52 p-0 bg-background border-border shadow-xl"
        align="end"
        sideOffset={4}
      >
        <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border font-medium">
          Tailwind {label}
        </div>
        <ScrollArea className="h-60">
          <div className="py-1">
            {primitives.map((p) => {
              const remVal = primitiveToRem(p.value);
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    onSelect(remVal);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground transition text-left"
                >
                  <span className="font-mono text-foreground">{p.name}</span>
                  <span className="font-mono text-muted-foreground text-[10px]">{p.value}px</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
