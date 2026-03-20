"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Copy, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Token, HSLValue } from "@/lib/tokens/schema";
import { hslToHex, hexToHsl, hslToCssString } from "@/lib/colorUtils";
import { TAILWIND_COLORS, SHADE_NAMES, COLOR_NAMES } from "@/lib/tokens/tailwindColors";
import { cn } from "@/lib/utils";

function hexToRgbString(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

interface CopyBtnProps {
  label: string;
  text: string;
  copiedFormat: string | null;
  onCopy: (text: string, format: string) => void;
}

function CopyBtn({ label, text, copiedFormat, onCopy }: CopyBtnProps) {
  const isCopied = copiedFormat === label;
  return (
    <button
      onClick={() => onCopy(text, label)}
      title={text}
      className={cn(
        "flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono border transition-colors",
        isCopied
          ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
          : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      {isCopied ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
      {label}
    </button>
  );
}

interface ColorTokenEditorProps {
  token: Token;
  value: HSLValue;
  onChange: (value: HSLValue) => void;
}

type EditorTab = "custom" | "tailwind";

interface TWSelection {
  colorName: string;
  shade: string;
  hex: string;
}

export function ColorTokenEditor({ token, value, onChange }: ColorTokenEditorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tab, setTab] = React.useState<EditorTab>("custom");
  const [localValue, setLocalValue] = React.useState<HSLValue>(value);
  const [hexInput, setHexInput] = React.useState(hslToHex(value));
  const [isValidHex, setIsValidHex] = React.useState(true);
  const [selectedTW, setSelectedTW] = React.useState<TWSelection | null>(null);
  const [copiedFormat, setCopiedFormat] = React.useState<string | null>(null);
  const isDragging = React.useRef(false);

  // Sync external value changes
  React.useEffect(() => {
    if (!isDragging.current) {
      setLocalValue(value);
      setHexInput(hslToHex(value));
    }
  }, [value]);

  // Auto-detect active TW color when popover opens
  React.useEffect(() => {
    if (!isOpen) return;
    const currentHex = hslToHex(value).slice(0, 7).toLowerCase();
    for (const colorName of COLOR_NAMES) {
      const scale = TAILWIND_COLORS[colorName];
      for (const shade of SHADE_NAMES) {
        if (scale[shade].toLowerCase() === currentHex) {
          setSelectedTW({ colorName, shade, hex: scale[shade] });
          return;
        }
      }
    }
    setSelectedTW(null);
  }, [isOpen, value]);

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 1500);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  // Derive copy format values from current color
  const currentHex6 = hslToHex(localValue).slice(0, 7);
  const copyFormats = [
    { label: "HEX", value: currentHex6 },
    { label: "RGB", value: hexToRgbString(currentHex6) },
    { label: "HSL", value: `hsl(${Math.round(localValue.h)}, ${Math.round(localValue.s)}%, ${Math.round(localValue.l)}%)` },
    { label: "Token", value: hslToCssString(localValue) },
  ];

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

  const handleTWSelect = (colorName: string, shade: string, hex: string) => {
    const hsl = hexToHsl(hex);
    if (typeof localValue.a === "number") hsl.a = localValue.a;
    setLocalValue(hsl);
    setHexInput(hex);
    onChange(hsl);
    setSelectedTW({ colorName, shade, hex });
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
      <PopoverContent className="w-[268px] bg-background border-border p-0 text-xs shadow-xl" align="end" sideOffset={8}>
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
            {/* Hex input + copy buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
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
              <div className="flex gap-1 flex-wrap">
                {copyFormats.map(({ label, value: fmtValue }) => (
                  <CopyBtn
                    key={label}
                    label={label}
                    text={fmtValue}
                    copiedFormat={copiedFormat}
                    onCopy={copyToClipboard}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "tailwind" && (
          <>
            <ScrollArea className="h-[280px]">
              <div className="p-2 flex flex-col gap-0.5">
                {COLOR_NAMES.map((colorName) => {
                  const scale = TAILWIND_COLORS[colorName];
                  return (
                    <div key={colorName} className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-muted-foreground w-[52px] shrink-0 capitalize">
                        {colorName}
                      </span>
                      <div className="flex flex-1 gap-px">
                        {SHADE_NAMES.map((shade) => {
                          const isSelected =
                            selectedTW?.colorName === colorName && selectedTW?.shade === shade;
                          return (
                            <button
                              key={shade}
                              title={`${colorName}-${shade}\n${scale[shade]}`}
                              onClick={() => handleTWSelect(colorName, shade, scale[shade])}
                              className={cn(
                                "flex-1 h-5 rounded-[2px] relative transition-transform",
                                isSelected
                                  ? "ring-2 ring-white ring-offset-1 scale-[1.25] z-10"
                                  : "hover:scale-110 hover:z-10"
                              )}
                              style={{ backgroundColor: scale[shade] }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Selected TW color info panel */}
            {selectedTW && (
              <div className="border-t border-border p-3 flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-9 w-9 rounded-md border border-border shrink-0 shadow-sm"
                    style={{ backgroundColor: selectedTW.hex }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-mono font-semibold capitalize">
                      {selectedTW.colorName}-{selectedTW.shade}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {selectedTW.hex}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {copyFormats.map(({ label, value: fmtValue }) => (
                    <CopyBtn
                      key={label}
                      label={label}
                      text={fmtValue}
                      copiedFormat={copiedFormat}
                      onCopy={copyToClipboard}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
