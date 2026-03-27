import { ThemeTokens, CustomToken, TokenValue, TokenGroup, TokenType } from "../tokens/schema";
import { hslToHex, hslToRgbFloat, isHSLValue, remToPx } from "../colorUtils";
import { TOKEN_DEFINITIONS } from "../tokens/defaults";
import { buildPrimitivesCollection, TAILWIND_PRIMITIVE_GROUPS } from "../tokens/tailwindPrimitives";
import { buildColorsCollection, TAILWIND_COLORS, SHADE_NAMES } from "../tokens/tailwindColors";

// Reverse lookup: "#rrggbb" → { collection, name } for every Tailwind palette entry
const HEX_TO_TAILWIND = new Map<string, { collection: string; name: string }>();
for (const [colorName, scale] of Object.entries(TAILWIND_COLORS)) {
  for (const shade of SHADE_NAMES) {
    HEX_TO_TAILWIND.set(scale[shade].toLowerCase(), {
      collection: "TailwindCSS Colors",
      name: `${colorName}/${shade}`,
    });
  }
}

// Reverse lookup: px value → { collection, name } for every Tailwind border-radius primitive
const PX_TO_TAILWIND_RADIUS = new Map<number, { collection: string; name: string }>();
{
  const radiusGroup = TAILWIND_PRIMITIVE_GROUPS.find(g => g.id === "border-radius");
  if (radiusGroup) {
    for (const token of radiusGroup.tokens) {
      PX_TO_TAILWIND_RADIUS.set(token.value, {
        collection: "TailwindCSS Primitives",
        name: `${radiusGroup.id}/${token.name}`,
      });
    }
  }
}

const GROUP_FOLDERS: Record<TokenGroup, string> = {
  "semantic-colors": "colors",
  "extended-palette": "colors",
  sidebar: "colors",
  radius: "radius",
  shadows: "shadows",
  spacing: "spacing",
  typography: "typography",
  custom: "custom",
};

/**
 * Resolves `var(--x)` and `calc(var(--x) ± Npx)` radius expressions to a
 * concrete rem string using the current mode's token map.
 */
function resolveRadiusCalc(value: string, modeTokens: Record<string, TokenValue>): string {
  if (!value.includes("var(")) return value;

  // var(--x) → dereference
  const varMatch = value.match(/^var\((--[a-z-]+)\)$/);
  if (varMatch) {
    const refVal = modeTokens[varMatch[1]];
    if (typeof refVal === "string" && !refVal.includes("var(") && !refVal.includes("calc("))
      return refVal;
    return value;
  }

  // calc(var(--x) ± Npx)
  const calcMatch = value.match(/^calc\(var\((--[a-z-]+)\)\s*([+-])\s*(\d+(?:\.\d+)?)px\)$/);
  if (calcMatch) {
    const [, varRef, op, pxStr] = calcMatch;
    const refVal = modeTokens[varRef];
    if (typeof refVal === "string") {
      let basePx: number;
      if (refVal.endsWith("rem")) basePx = parseFloat(refVal) * 16;
      else if (refVal.endsWith("px")) basePx = parseFloat(refVal);
      else { const n = parseFloat(refVal); basePx = isNaN(n) ? 0 : n * 16; }
      const delta = parseFloat(pxStr);
      const result = op === "+" ? basePx + delta : basePx - delta;
      const rem = result / 16;
      return `${+rem.toFixed(4)}rem`;
    }
  }

  return value;
}

function formatFigmaValue(type: TokenType, value: TokenValue): unknown {
  if (type === "color" && isHSLValue(value)) {
    if (value.a === undefined) {
      const hex = hslToHex(value).toLowerCase();
      const alias = HEX_TO_TAILWIND.get(hex);
      if (alias) return alias;
    }
    return hslToRgbFloat(value);
  }

  if (type === "fontFamily" && typeof value === "string") {
    return value.split(",")[0].trim();
  }

  if (type === "radius") {
    // px value (e.g. "9999px") should NOT go through remToPx (which multiplies by 16)
    const px = (typeof value === "string" && value.includes("rem"))
      ? remToPx(value)
      : parseFloat(String(value));
    if (!isNaN(px)) {
      const alias = PX_TO_TAILWIND_RADIUS.get(px);
      if (alias) return alias;
      return px;
    }
  }

  if (type === "spacing" || type === "fontSize" || type === "lineHeight" || type === "fontWeight") {
    if (typeof value === "string" && value.includes("rem")) {
      return remToPx(value);
    }
    const num = parseFloat(String(value));
    // Unparseable (e.g. calc() expressions) — fall through to STRING
    if (!isNaN(num)) return num;
  }

  return String(value);
}

function resolveFigmaType(type: TokenType, formattedValue: unknown): string {
  if (type === "color") return "COLOR";
  if (typeof formattedValue === "number") return "FLOAT";
  // Alias to another variable (e.g. TailwindCSS Primitives) — inherit the target's type
  if (typeof formattedValue === "object" && formattedValue !== null && "collection" in formattedValue) {
    return "FLOAT";
  }
  return "STRING";
}

export function exportToFigma(tokens: ThemeTokens, customTokens: CustomToken[]): string {
  const variables: Record<string, unknown>[] = [];
  const allDefinitions = [...TOKEN_DEFINITIONS, ...customTokens];

  for (const def of allDefinitions) {
    let lightVal = tokens.light[def.cssVar];
    let darkVal = tokens.dark[def.cssVar];

    if (lightVal === undefined && darkVal === undefined) continue;

    // Resolve calc/var radius expressions to concrete values using the current token map
    if (def.type === "radius") {
      if (typeof lightVal === "string") lightVal = resolveRadiusCalc(lightVal, tokens.light);
      if (typeof darkVal === "string") darkVal = resolveRadiusCalc(darkVal, tokens.dark);
    }

    const cleanName = def.cssVar.replace(/^--/, "");
    const folder = GROUP_FOLDERS[def.group] || "misc";

    const lightFigmaVal = lightVal !== undefined ? formatFigmaValue(def.type, lightVal) : undefined;
    const darkFigmaVal = darkVal !== undefined ? formatFigmaValue(def.type, darkVal) : lightFigmaVal;

    // Derive the Figma type from the actual formatted value so calc() strings
    // don't produce a FLOAT variable with a string value.
    const figmaType = resolveFigmaType(def.type, lightFigmaVal ?? darkFigmaVal);

    variables.push({
      name: `${folder}/${cleanName}`,
      type: figmaType,
      description: def.description,
      valuesByMode: {
        light: lightFigmaVal,
        dark: darkFigmaVal,
      },
    });
  }

  return JSON.stringify({
    collections: [
      buildColorsCollection(),
      buildPrimitivesCollection(),
      {
        name: "Theme Studio",
        modes: ["light", "dark"],
        variables
      }
    ]
  }, null, 2);
}
