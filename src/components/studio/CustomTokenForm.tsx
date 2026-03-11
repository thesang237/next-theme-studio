"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenType } from "@/lib/tokens/schema";

const TYPE_OPTIONS: { value: TokenType; label: string }[] = [
  { value: "color", label: "Color" },
  { value: "radius", label: "Radius" },
  { value: "spacing", label: "Spacing" },
  { value: "fontSize", label: "Font Size" },
  { value: "shadow", label: "Shadow" },
  { value: "custom", label: "Custom" },
];

export function CustomTokenForm() {
  const [cssVar, setCssVar] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [type, setType] = React.useState<TokenType>("color");

  const addCustomToken = useThemeStore((state) => state.addCustomToken);
  const customTokens = useThemeStore((state) => state.customTokens);
  const tokens = useThemeStore((state) => state.tokens);

  const formattedCssVar = cssVar.startsWith("--") ? cssVar : cssVar ? `--${cssVar}` : "";

  // Validation
  const isValidFormat = formattedCssVar.length > 2 && /^[a-z0-9-]+$/.test(formattedCssVar.slice(2));
  const isDuplicate = 
    tokens.light?.[formattedCssVar] !== undefined || 
    customTokens.some((t) => t.cssVar === formattedCssVar);
  const isValid = isValidFormat && !isDuplicate && label.trim().length > 0;

  const handleAdd = () => {
    if (!isValid) return;

    addCustomToken({
      cssVar: formattedCssVar,
      description: label.trim(),
      type: "custom",
      label: label.trim(),
      supportsAlpha: true,
      editable: true,
      group: "custom",
    });

    setCssVar("");
    setLabel("");
    setType("color");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-2 mt-1 mx-2 bg-card/50 rounded-lg border border-border/50">
      <div className="flex items-center bg-background border border-border rounded px-1.5 h-7 focus-within:ring-1 focus-within:ring-ring">
        <span className="text-muted-foreground font-mono text-xs select-none">--</span>
        <input
          value={cssVar.startsWith("--") ? cssVar.slice(2) : cssVar}
          onChange={(e) => setCssVar(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          onKeyDown={handleKeyDown}
          placeholder="my-token"
          className={`bg-transparent outline-none w-24 text-xs font-mono pl-0.5 ${
            isDuplicate && cssVar ? "text-red-400" : "text-foreground"
          }`}
        />
      </div>

      <Input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Token Label"
        className="h-7 w-32 text-xs bg-background border-border focus-visible:ring-1 focus-visible:ring-ring"
      />

      <Select value={type} onValueChange={(val) => setType(val as TokenType)}>
        <SelectTrigger className="h-7 w-[100px] text-xs bg-background border-border focus:ring-1 focus:ring-ring">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background border-border">
          {TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        onClick={handleAdd}
        disabled={!isValid}
        className="flex items-center justify-center w-7 h-7 ml-auto shrink-0 bg-muted text-muted-foreground rounded shadow-sm hover:bg-white disabled:opacity-50 disabled:pointer-events-none transition-colors"
        title="Add Token"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
