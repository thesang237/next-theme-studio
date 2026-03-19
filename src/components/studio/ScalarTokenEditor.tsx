"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";
import { Token } from "@/lib/tokens/schema";
import { PrimitivePicker } from "./PrimitivePicker";

interface ScalarTokenEditorProps {
  token: Token;
  value: string;
  onChange: (value: string) => void;
}

interface SliderConfig {
  min: number;
  max: number;
  step: number;
  unit: string;
  showSlider: boolean;
}

const SLIDER_CONFIG: Record<string, SliderConfig> = {
  radius:   { min: 0,   max: 2,   step: 0.05, unit: "rem", showSlider: true  },
  spacing:  { min: 0,   max: 8,   step: 0.25, unit: "rem", showSlider: true  },
  fontSize: { min: 0.5, max: 4,   step: 0.05, unit: "rem", showSlider: true  },
};

const DEFAULT_CONFIG: SliderConfig = { min: 0, max: 100, step: 1, unit: "", showSlider: false };

export function ScalarTokenEditor({ token, value, onChange }: ScalarTokenEditorProps) {
  const { min, max, step, unit, showSlider } = SLIDER_CONFIG[token.type] ?? DEFAULT_CONFIG;

  // Parse numeric part
  let parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) {
    // maybe try to extract number
    const match: any = value.match(/^-?\d*\.?\d+/);
    if (match) parsedValue = parseFloat(match[0]);
    else parsedValue = min;
  }

  const [localValue, setLocalValue] = React.useState<string>(parsedValue.toString());

  React.useEffect(() => {
    let num = parseFloat(value);
    if (isNaN(num)) {
       const match: any = value.match(/^-?\d*\.?\d+/);
       if (match) num = parseFloat(match[0]);
       else num = min;
    }
    setLocalValue(num.toString());
  }, [value, min]);

  const commitValue = (val: number) => {
    let clamped = Math.max(min, Math.min(max, val));
    setLocalValue(clamped.toString());
    onChange(`${clamped}${unit}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleInputBlur = () => {
    let val = parseFloat(localValue);
    if (isNaN(val)) val = min;
    commitValue(val);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      let val = parseFloat(localValue);
      if (isNaN(val)) val = min;
      commitValue(val + step);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      let val = parseFloat(localValue);
      if (isNaN(val)) val = min;
      commitValue(val - step);
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <PrimitivePicker tokenType={token.type} onSelect={onChange} />
      {showSlider && (
        <SliderPrimitive.Root
          className="relative flex w-24 touch-none select-none items-center"
          value={[parseFloat(localValue) || min]}
          min={min}
          max={max}
          step={step}
          onValueChange={([val]) => commitValue(val)}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-popover">
            <SliderPrimitive.Range className="absolute h-full bg-muted" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full bg-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
      )}

      <Input
        value={localValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        className="h-7 w-16 text-right text-xs font-mono bg-card border-border focus-visible:ring-1 focus-visible:ring-ring px-2"
        placeholder={min.toString()}
      />

      {unit && (
        <span className="flex items-center justify-center h-7 px-1.5 rounded bg-muted text-muted-foreground font-mono text-[10px] leading-none shrink-0 border border-input">
          {unit}
        </span>
      )}
    </div>
  );
}
