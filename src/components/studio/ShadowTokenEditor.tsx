"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Token } from "@/lib/tokens/schema";

interface ShadowTokenEditorProps {
  token: Token;
  value: string;
  onChange: (value: string) => void;
}

export function ShadowTokenEditor({ value, onChange }: ShadowTokenEditorProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center justify-center w-12 h-8 rounded bg-popover shrink-0 border border-input">
        <div
          className="w-10 h-6 bg-white rounded-sm"
          style={{ boxShadow: value }}
        />
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="text-xs font-mono bg-card border-border focus-visible:ring-1 focus-visible:ring-ring py-1 px-2 resize-none leading-relaxed"
      />
    </div>
  );
}
