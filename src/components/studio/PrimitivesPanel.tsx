"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TAILWIND_PRIMITIVE_GROUPS, type TailwindPrimitiveGroup } from "@/lib/tokens/tailwindPrimitives";
import { TAILWIND_COLORS, SHADE_NAMES, COLOR_NAMES } from "@/lib/tokens/tailwindColors";
import { ChevronRight } from "lucide-react";

// ── Color section ─────────────────────────────────────────────────────────────

function ColorsSection() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-medium text-foreground hover:bg-accent/50 transition"
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            className="w-3.5 h-3.5 text-muted-foreground transition-transform"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          />
          <span>Colors</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {COLOR_NAMES.length} palettes
        </span>
      </button>

      {open && (
        <div className="px-4 pb-3 flex flex-col gap-1">
          {/* Shade labels */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-[52px] shrink-0" />
            <div className="flex flex-1 gap-px">
              {SHADE_NAMES.map((s) => (
                <span key={s} className="flex-1 text-center text-[8px] font-mono text-muted-foreground">
                  {s === "50" || s === "500" || s === "950" ? s : ""}
                </span>
              ))}
            </div>
          </div>

          {COLOR_NAMES.map((colorName) => {
            const scale = TAILWIND_COLORS[colorName];
            return (
              <div key={colorName} className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-muted-foreground w-[52px] shrink-0 capitalize">
                  {colorName}
                </span>
                <div className="flex flex-1 gap-px">
                  {SHADE_NAMES.map((shade) => (
                    <div
                      key={shade}
                      title={`${colorName}-${shade} ${scale[shade]}`}
                      className="flex-1 h-4 rounded-[2px]"
                      style={{ backgroundColor: scale[shade] }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Numeric/other groups ──────────────────────────────────────────────────────

function PrimitiveGroupSection({ group }: { group: TailwindPrimitiveGroup }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-medium text-foreground hover:bg-accent/50 transition"
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            className="w-3.5 h-3.5 text-muted-foreground transition-transform"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          />
          <span>{group.label}</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {group.tokens.length}
        </span>
      </button>

      {open && (
        <div className="pb-1">
          {group.tokens.map((token) => (
            <div
              key={token.name}
              className="flex items-center justify-between px-4 py-1 hover:bg-accent/30 transition"
            >
              <span className="font-mono text-[11px] text-foreground">{token.name}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {token.value}{group.figmaType === "FLOAT" ? "px" : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Panel ─────────────────────────────────────────────────────────────────────

export function PrimitivesPanel() {
  return (
    <ScrollArea className="flex-1 min-h-0 w-full">
      <div className="pb-12">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            TailwindCSS v4 design primitives. Included as the first two collections in every Figma export.
          </p>
        </div>
        <ColorsSection />
        {TAILWIND_PRIMITIVE_GROUPS.map((group) => (
          <PrimitiveGroupSection key={group.id} group={group} />
        ))}
      </div>
    </ScrollArea>
  );
}
