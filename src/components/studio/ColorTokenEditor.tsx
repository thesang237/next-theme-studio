"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Token, HSLValue } from "@/lib/tokens/schema";
import { hslToHex, hexToHsl, hslToCssString } from "@/lib/colorUtils";
import { cn } from "@/lib/utils";

interface ColorTokenEditorProps {
  token: Token;
  value: HSLValue;
  onChange: (value: HSLValue) => void;
}


export function ColorTokenEditor({ token, value, onChange }: ColorTokenEditorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localValue, setLocalValue] = React.useState<HSLValue>(value);
  const [hexInput, setHexInput] = React.useState(hslToHex(value));
  const [isValidHex, setIsValidHex] = React.useState(true);
  // Track whether the user is actively dragging a slider so we don't
  // overwrite localValue mid-drag when an external store update arrives
  const isDragging = React.useRef(false);

  // S4 fix: sync from store whenever value changes, unless actively dragging
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
      // preserve alpha if supported
      if (typeof localValue.a === "number") {
        hsl.a = localValue.a;
      }
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

  const hasAlpha = typeof localValue.a === "number";

  // Gradients for sliders
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
      <PopoverContent className="w-[240px] bg-background border-border p-3 pt-4 text-xs shadow-xl" align="end" sideOffset={8}>
        <div className="flex flex-col gap-4">
          {/* Big Preview */}
          <div 
            className="w-full h-12 rounded-md shadow-inner border border-border"
            style={{ backgroundColor: `hsl(${hslToCssString(localValue)})` }}
          />

          {/* Sliders */}
          <div className="flex flex-col gap-3">
            {/* H */}
            <div className="flex items-center gap-2">
              <span className="w-3 text-muted-foreground font-mono">H</span>
              <SliderPrimitive.Root
                className="relative flex w-full touch-none select-none items-center"
                value={[localValue.h]}
                max={360}
                step={1}
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

            {/* S */}
            <div className="flex items-center gap-2">
              <span className="w-3 text-muted-foreground font-mono">S</span>
              <SliderPrimitive.Root
                className="relative flex w-full touch-none select-none items-center"
                value={[localValue.s]}
                max={100}
                step={1}
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

            {/* L */}
            <div className="flex items-center gap-2">
              <span className="w-3 text-muted-foreground font-mono">L</span>
              <SliderPrimitive.Root
                className="relative flex w-full touch-none select-none items-center"
                value={[localValue.l]}
                max={100}
                step={1}
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

            {/* A (optional) */}
            {hasAlpha && (
              <div className="flex items-center gap-2">
                <span className="w-3 text-muted-foreground font-mono">A</span>
                <SliderPrimitive.Root
                  className="relative flex w-full touch-none select-none items-center"
                  value={[localValue.a! * 100]}
                  max={100}
                  step={1}
                  onValueChange={([a]) => { isDragging.current = true; updateColor({ a: a / 100 }); }}
                  onValueCommit={() => { isDragging.current = false; }}
                >
                  <div className="absolute inset-0 rounded-full" style={{ backgroundImage: 'conic-gradient(#fff 90deg, #ccc 90deg 180deg, #fff 180deg 270deg, #ccc 270deg)', backgroundSize: '8px 8px' }} />
                  <SliderPrimitive.Track className={sliderTrackClass} style={{ background: aGradient }} />
                  <SliderPrimitive.Thumb className={sliderThumbClass} />
                </SliderPrimitive.Root>
                <div className="w-8 text-right font-mono text-foreground bg-card rounded px-1 py-0.5 border border-border">
                  {Math.round(localValue.a! * 100)}
                </div>
              </div>
            )}
          </div>

          {/* Hex Input */}
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
      </PopoverContent>
    </Popover>
  );
}
