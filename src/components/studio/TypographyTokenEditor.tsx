"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Token } from "@/lib/tokens/schema";
import { ScalarTokenEditor } from "./ScalarTokenEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TypographyTokenEditorProps {
  token: Token;
  value: string;
  onChange: (value: string) => void;
}

const FONT_WEIGHTS = [
  { value: "100", label: "Thin" },
  { value: "200", label: "ExtraLight" },
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "SemiBold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "ExtraBold" },
  { value: "900", label: "Black" },
];

export function TypographyTokenEditor({ token, value, onChange }: TypographyTokenEditorProps) {
  if (token.type === "fontSize" || token.type === "lineHeight") {
    return <ScalarTokenEditor token={token} value={value} onChange={onChange} />;
  }

  if (token.type === "fontWeight") {
    return (
      <Select value={value || ""} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="h-7 w-[120px] text-xs bg-card border-border focus:ring-1 focus:ring-ring">
          <SelectValue placeholder="Select weight" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          {FONT_WEIGHTS.map((fw) => (
            <SelectItem key={fw.value} value={fw.value} className="text-xs">
              {fw.label} <span className="text-muted-foreground ml-1">({fw.value})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const FONT_FAMILIES = [
    { value: "ui-sans-serif, system-ui, sans-serif", label: "System Sans" },
    { value: "ui-serif, Georgia, serif", label: "System Serif" },
    { value: "ui-monospace, SFMono-Regular, monospace", label: "System Mono" },
    { value: "Inter, sans-serif", label: "Inter" },
    { value: "Roboto, sans-serif", label: "Roboto" },
    { value: "Geist, sans-serif", label: "Geist" },
    { value: "Roboto Mono, monospace", label: "Roboto Mono" },
    { value: "JetBrains Mono, monospace", label: "JetBrains Mono" },
  ];

  if (token.type === "fontFamily") {
    const isPreset = FONT_FAMILIES.some((f) => f.value === value);

    return (
      <Select
        value={isPreset ? value : value || ""}
        onValueChange={(v) => v && onChange(v)}
      >
        <SelectTrigger className="h-7 w-[140px] text-xs bg-card border-border focus:ring-1 focus:ring-ring">
          <div className="truncate flex-1 text-left">
            <SelectValue placeholder={!isPreset && value ? value : "Select font..."} />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          {FONT_FAMILIES.map((ff) => (
            <SelectItem key={ff.value} value={ff.value} className="text-xs">
              <span style={{ fontFamily: ff.value }}>{ff.label}</span>
            </SelectItem>
          ))}
          {!isPreset && value && (
            <SelectItem value={value} className="text-xs max-w-[300px]">
              <span style={{ fontFamily: value }}>{value}</span>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    );
  }

  // Fallback
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 text-xs font-mono bg-card border-border focus-visible:ring-1 focus-visible:ring-ring"
    />
  );
}
