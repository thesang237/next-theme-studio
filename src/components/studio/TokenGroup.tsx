"use client";

import * as React from "react";
import { ChevronRight, RotateCcw } from "lucide-react";
import { TokenGroup as SchemaTokenGroup, CustomToken } from "@/lib/tokens/schema";
import { TOKEN_GROUPS } from "@/lib/tokens/groups";
import { TokenRow } from "./TokenRow";
import { CustomTokenForm } from "./CustomTokenForm";
import { useThemeStore } from "@/store/themeStore";

interface TokenGroupProps {
  group: typeof TOKEN_GROUPS[number];
  customTokens?: CustomToken[];
  activeMode: "light" | "dark";
}

export function TokenGroup({ group, customTokens = [], activeMode }: TokenGroupProps) {
  const [isOpen, setIsOpen] = React.useState(group.defaultOpen);
  const resetToken = useThemeStore((state) => state.resetToken);

  const tokenCount = group.tokens.length + customTokens.length;

  const handleResetGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    group.tokens.forEach((token: any) => resetToken(token.cssVar));
  };

  return (
    <div className="flex flex-col border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group/header flex items-center justify-between w-full h-8 px-2 select-none hover:bg-popover transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-150 ${isOpen ? "rotate-90" : "rotate-0"
              }`}
          />
          <span className="text-sm font-medium text-foreground">{group.label}</span>
          <span className="flex items-center justify-center h-4 px-1.5 rounded-full bg-popover text-muted-foreground text-[10px] font-medium leading-none">
            {tokenCount}
          </span>
        </div>

        <span
          onClick={handleResetGroup}
          className="opacity-0 group-hover/header:opacity-100 p-1 text-muted-foreground hover:text-accent-foreground transition-colors rounded hover:bg-accent hover:text-accent-foreground"
          title="Reset all tokens in group"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col py-1">
            {group.tokens.map((token: any) => (
              <TokenRow key={token.cssVar} token={token} activeMode={activeMode} />
            ))}

            {group.id === "custom" && customTokens.map((ct) => (
              <TokenRow
                key={ct.id}
                token={{ ...ct }}
                activeMode={activeMode}
                isCustom
              />
            ))}

            {group.id === "custom" && <CustomTokenForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
