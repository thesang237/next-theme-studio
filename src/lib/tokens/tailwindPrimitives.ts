import rawData from "../../../examples/TailwindCSS/Default.tokens.json";
import type { TokenType } from "./schema";

// ── Types ────────────────────────────────────────────────────────────────────

export interface TailwindPrimitive {
  name: string;
  value: number;
  scopes: string[];
}

export interface TailwindPrimitiveGroup {
  id: string;
  label: string;
  figmaType: "FLOAT" | "COLOR" | "STRING";
  tokens: TailwindPrimitive[];
}

type W3CEntry = {
  $type: string;
  $value: number | string;
  $extensions?: { "com.figma.scopes"?: string[] };
};
type W3CFile = Record<string, Record<string, W3CEntry>>;

// ── Labels ───────────────────────────────────────────────────────────────────

const GROUP_LABELS: Record<string, string> = {
  "spacing": "Spacing",
  "width": "Width",
  "min-width": "Min Width",
  "max-width": "Max Width",
  "height": "Height",
  "breakpoint": "Breakpoints",
  "border-radius": "Border Radius",
  "border-width": "Border Width",
  "opacity": "Opacity",
  "line-height": "Line Height",
};

// ── Parse ────────────────────────────────────────────────────────────────────

function toFigmaType(w3c: string): "FLOAT" | "COLOR" | "STRING" {
  if (w3c === "color") return "COLOR";
  if (w3c === "number") return "FLOAT";
  return "STRING";
}

const EXCLUDED_GROUPS = new Set(["tailwind colors", "$extensions"]);

export const TAILWIND_PRIMITIVE_GROUPS: TailwindPrimitiveGroup[] = (() => {
  const data = rawData as unknown as W3CFile;
  return Object.entries(data).filter(([groupId]) => !EXCLUDED_GROUPS.has(groupId)).map(([groupId, group]) => {
    const entries = Object.entries(group);
    return {
      id: groupId,
      label: GROUP_LABELS[groupId] ?? groupId,
      figmaType: toFigmaType(entries[0]?.[1]?.$type ?? "string"),
      tokens: entries.map(([name, entry]) => ({
        name,
        value: typeof entry.$value === "number" ? entry.$value : 0,
        scopes: entry.$extensions?.["com.figma.scopes"] ?? [],
      })),
    };
  });
})();

// ── Lookup ───────────────────────────────────────────────────────────────────

const PRIMITIVES_FOR_TYPE: Partial<Record<TokenType, string>> = {
  radius: "border-radius",
  spacing: "spacing",
};

export function getPrimitivesForTokenType(type: TokenType): TailwindPrimitive[] {
  const groupId = PRIMITIVES_FOR_TYPE[type];
  if (!groupId) return [];
  return TAILWIND_PRIMITIVE_GROUPS.find((g) => g.id === groupId)?.tokens ?? [];
}

// ── Value conversion ─────────────────────────────────────────────────────────

/** Convert a px value from a Tailwind primitive to the rem string ScalarTokenEditor expects. */
export function primitiveToRem(px: number): string {
  const rem = px / 16;
  const str = rem.toFixed(4).replace(/\.?0+$/, "");
  return `${str}rem`;
}

// ── Figma export ─────────────────────────────────────────────────────────────

/** Build the first Figma collection for TailwindCSS primitives (single mode). */
export function buildPrimitivesCollection(): object {
  const variables: object[] = [];
  for (const group of TAILWIND_PRIMITIVE_GROUPS) {
    for (const token of group.tokens) {
      variables.push({
        name: `${group.id}/${token.name}`,
        type: group.figmaType,
        valuesByMode: { Value: token.value },
      });
    }
  }
  return { name: "TailwindCSS Primitives", modes: ["Value"], variables };
}
