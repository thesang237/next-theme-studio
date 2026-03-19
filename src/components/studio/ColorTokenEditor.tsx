"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Token, HSLValue } from "@/lib/tokens/schema";
import { hslToHex, hexToHsl, hslToCssString } from "@/lib/colorUtils";
import { TAILWIND_COLORS, SHADE_NAMES, COLOR_NAMES } from "@/lib/tokens/tailwindColors";
import { cn } from "@/lib/utils";

interface ColorTokenEditorProps {
  token: Token;
  value: HSLValue;
  onChange: (value: HSLValue) => void;
}

type EditorTab = "custom" | "tailwind";

export function ColorTokenEditor({ token, value, onChange }: ColorTokenEditorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tab, setTab] = React.useState<EditorTab>("custom");
  const [localValue, setLocalValue] = React.useState<HSLValue>(value);
  const [hexInput, setHexInput] = React.useState(hslToHex(value));
  const [isValidHex, setIsValidHex] = React.useState(true);
  const isDragging = React.useRef(false);

  React.useEffect(() => {
    if (!isDragging.current) {
      setLocalValue(value);
      setHexInput(hslToHex(value));
    }
  }, [value]);

  const updateColor = (updates: Partial<HSLValue>) => {
    const nextValue = { ...localValue, ...updates };
    setLocalValue(nextValue);
    setHexInput(hslToHex(nextValue));
    onChange(nextValue);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setIsValidHex(true);
      const hsl = hexToHsl(val);
      if (typeof localValue.a === "number") hsl.a = localValue.a;
      setLocalValue(hsl);
      onChange(hsl);
    } else {
      setIsValidHex(false);
    }
  };

  const handleHexBlur = () => {
    if (!isValidHex) {
      setHexInput(hslToHex(localValue));
      setIsValidHex(true);
    }
  };

  const applyHex = (hex: string) => {
    const hsl = hexToHsl(hex);
    if (typeof localValue.a === "number") hsl.a = localValue.a;
    setLocalValue(hsl);
    setHexInput(hex);
    onChange(hsl);
    setIsOpen(false);
  };

  const hasAlpha = typeof localValue.a === "number";

  const hGradient = `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)`;
  const sGradient = `linear-gradient(to right, hsl(${localValue.h}, 0%, ${localValue.l}%), hsl(${localValue.h}, 100%, ${localValue.l}%))`;
  const lGradient = `linear-gradient(to right, #000 0%, hsl(${localValue.h}, ${localValue.s}%, 50%) 50%, #fff 100%)`;
  const aGradient = `linear-gradient(to right, transparent, hsl(${localValue.h}, ${localValue.s}%, ${localValue.l}%))`;

  const sliderTrackClass = "relative h-3 w-full grow overflow-hidden rounded-full";
  const sliderThumbClass = "block h-4 w-4 rounded-full border border-input bg-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <button
            className="h-6 w-6 rounded border border-input shadow-sm transition-all hover:ring-1 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ backgroundColor: `hsl(${hslToCssString(value)})` }}
            aria-label={`Edit ${token.cssVar}`}
          />
        }
      />
      <PopoverContent className="w-[260px] bg-background border-border p-0 text-xs shadow-xl" align="end" sideOffset={8}>
        {/* Tab bar */}
        <div className="flex border-b border-border px-1 pt-1 gap-0.5">
          <button
            onClick={() => setTab("custom")}
            className={cn(
              "flex-1 h-7 rounded-t text-[11px] font-medium transition",
              tab === "custom" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Custom
          </button>
          <button
            onClick={() => setTab("tailwind")}
            className={cn(
              "flex-1 h-7 rounded-t text-[11px] font-medium transition",
              tab === "tailwind" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Tailwind
          </button>
        </div>

        {tab === "custom" && (
          <div className="flex flex-col gap-4 p-3 pt-4">
            {/* Preview */}
            <div
              className="w-full h-10 rounded-md shadow-inner border border-border"
              style={{ backgroundColor: `hsl(${hslToCssString(localValue)})` }}
            />
            {/* Sliders */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 text-muted-foreground font-mono">H</span>
                <SliderPrimitive.Root
                  className="relative flex w-full touch-none select-none items-center"
                  value={[localValue.h]} max={360} step={1}
                  onValueChange={([h]) => { isDragging.current = true; updateColor({ h }); }}
                  onValueCommit={() => { isDragging.current = false; }}
                >
                  <SliderPrimitive.Track className={sliderTrackClass} style={{ background: hGradient }} />
                  <SliderPrimitive.Thumb className={sliderThumbClass} />
                </SliderPrimitive.Root>
                <div className="w-8 text-right font-mono text-foreground bg-card rounded px-1 py-0.5 border border-border">
                  {Math.round(localValue.h)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 text-muted-foreground font-mono">S</span>
                <SliderPrimitive.Root
                  className="relative flex w-full touch-none select-none items-center"
                  value={[localValue.s]} max={100} step={1}
                  onValueChange={([s]) => { isDragging.current = true; updateColor({ s }); }}
                  onValueCommit={() => { isDragging.current = false; }}
                >
                  <SliderPrimitive.Track className={sliderTrackClass} style={{ background: sGradient }} />
                  <SliderPrimitive.Thumb className={sliderThumbClass} />
                </SliderPrimitive.Root>
                <div className="w-8 text-right font-mono text-foreground bg-card rounded px-1 py-0.5 border border-border">
                  {Math.round(localValue.s)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 text-muted-foreground font-mono">L</span>
                <SliderPrimitive.Root
                  className="relative flex w-full touch-none select-none items-center"
                  value={[localValue.l]} max={100} step={1}
                  onValueChange={([l]) => { isDragging.current = true; updateColor({ l }); }}
                  onValueCommit={() => { isDragging.current = false; }}
                >
                  <SliderPrimitive.Track className={sliderTrackClass} style={{ background: lGradient }} />
                  <SliderPrimitive.Thumb className={sliderThumbClass} />
                </SliderPrimitive.Root>
                <div className="w-8 text-right font-mono text-foreground bg-card rounded px-1 py-0.5 border border-border">
                  {Math.round(localValue.l)}
                </div>
              </div>
              {hasAlpha && (
                <div className="flex items-center gap-2">
                  <span className="w-3 text-muted-foreground font-mono">A</span>
                  <SliderPrimitive.Root
                    className="relative flex w-full touch-none select-none items-center"
                    value={[localValue.a! * 100]} max={100} step={1}
                    onValueChange={([a]) => { isDragging.current = true; updateColor({ a: a / 100 }); }}
                    onValueCommit={() => { isDragging.current = false; }}
                  >
                    <div className="absolute inset-0 rounded-full" style={{ backgroundImage: "conic-gradient(#fff 90deg, #ccc 90deg 180deg, #fff 180deg 270deg, #ccc 270deg)", backgroundSize: "8px 8px" }} />
                    <SliderPrimitive.Track className={sliderTrackClass} style={{ background: aGradient }} />
                    <SliderPrimitive.Thumb className={sliderThumbClass} />
                  </SliderPrimitive.Root>
                  <div className="w-8 text-right font-mono text-foreground bg-card rounded px-1 py-0.5 border border-border">
                    {Math.round(localValue.a! * 100)}
                  </div>
                </div>
              )}
            </div>
            {/* Hex */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <span className="text-muted-foreground font-mono w-8">Hex</span>
              <Input
                value={hexInput}
                onChange={handleHexChange}
                onBlur={handleHexBlur}
                className={cn(
                  "h-7 text-xs font-mono bg-card border-border focus-visible:ring-1 focus-visible:ring-ring",
                  !isValidHex && "border-red-500 focus-visible:ring-red-500 text-red-400"
                )}
                maxLength={7}
              />
            </div>
          </div>
        )}

        {tab === "tailwind" && (
          <ScrollArea className="h-[300px]">
            <div className="p-2 flex flex-col gap-0.5">
              {COLOR_NAMES.map((colorName) => {
                const scale = TAILWIND_COLORS[colorName];
                return (
                  <div key={colorName} className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-muted-foreground w-[52px] shrink-0 capitalize">
                      {colorName}
                    </span>
                    <div className="flex flex-1 gap-px">
                      {SHADE_NAMES.map((shade) => (
                        <button
                          key={shade}
                          title={`${colorName}-${shade} ${scale[shade]}`}
                          onClick={() => applyHex(scale[shade])}
                          className="flex-1 h-5 rounded-[2px] hover:scale-110 hover:z-10 relative transition-transform"
                          style={{ backgroundColor: scale[shade] }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
