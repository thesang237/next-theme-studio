import { ThemeTokens, CustomToken, TokenValue, TokenGroup, TokenType } from "../tokens/schema";
import { hslToHex, hslToRgbFloat, isHSLValue, remToPx } from "../colorUtils";
import { TOKEN_DEFINITIONS } from "../tokens/defaults";
import { buildPrimitivesCollection } from "../tokens/tailwindPrimitives";
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

  if (type === "radius" || type === "spacing" || type === "fontSize" || type === "lineHeight" || type === "fontWeight") {
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
  return "STRING";
}

export function exportToFigma(tokens: ThemeTokens, customTokens: CustomToken[]): string {
  const variables: Record<string, unknown>[] = [];
  const allDefinitions = [...TOKEN_DEFINITIONS, ...customTokens];

  for (const def of allDefinitions) {
    const lightVal = tokens.light[def.cssVar];
    const darkVal = tokens.dark[def.cssVar];

    if (lightVal === undefined && darkVal === undefined) continue;

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
