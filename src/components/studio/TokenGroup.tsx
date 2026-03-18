"use client";

import * as React from "react";
import { ChevronRight, RotateCcw } from "lucide-react";
import { TokenGroup as SchemaTokenGroup, CustomToken, Token } from "@/lib/tokens/schema";
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
    group.tokens.forEach((token: Token) => resetToken(token.cssVar));
  };

  return (
    <div className="flex flex-col border-b border-border last:border-0">
      {/* Group header row: button + sibling reset action (never nested) */}
      <div className="group/header flex items-center w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex items-center gap-2 flex-1 h-8 px-2 select-none hover:bg-popover transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <ChevronRight
            className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-150 ${isOpen ? "rotate-90" : "rotate-0"
              }`}
          />
          <span className="text-sm font-medium text-foreground">{group.label}</span>
          <span className="flex items-center justify-center h-4 px-1.5 rounded-full bg-popover text-muted-foreground text-[10px] font-medium leading-none">
            {tokenCount}
          </span>
        </button>

        <button
          onClick={handleResetGroup}
          className="opacity-0 group-hover/header:opacity-100 mr-1 p-1 text-muted-foreground hover:text-accent-foreground transition-colors rounded hover:bg-accent"
          aria-label={`Reset all ${group.label} tokens to default`}
          title="Reset all tokens in group"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

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
