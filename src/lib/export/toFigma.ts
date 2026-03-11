import { ThemeTokens, CustomToken, TokenValue, TokenGroup, TokenType } from "../tokens/schema";
import { hslToRgbFloat, isHSLValue, remToPx } from "../colorUtils";
import { TOKEN_DEFINITIONS } from "../tokens/defaults";

const GROUP_FOLDERS: Record<TokenGroup, string> = {
  "semantic-colors": "colors",
  "extended-palette": "colors",
  radius: "radius",
  shadows: "shadows",
  spacing: "spacing",
  typography: "typography",
  custom: "custom",
};

function formatFigmaValue(type: TokenType, value: TokenValue): unknown {
  if (type === "color" && isHSLValue(value)) {
    return hslToRgbFloat(value);
  }

  if (type === "radius" || type === "spacing" || type === "fontSize" || type === "lineHeight") {
    // Treat as FLOAT
    if (typeof value === "string" && value.includes("rem")) {
       return remToPx(value);
    }
    const num = parseFloat(String(value));
    return isNaN(num) ? value : num;
  }

  return String(value);
}

function getFigmaType(type: TokenType): string {
  if (type === "color") return "COLOR";
  if (type === "radius" || type === "spacing" || type === "fontSize" || type === "lineHeight") return "FLOAT";
  return "STRING";
}

export function exportToFigma(tokens: ThemeTokens, customTokens: CustomToken[]): string {
  const variables: Record<string, unknown>[] = [];
  const allDefinitions = [...TOKEN_DEFINITIONS, ...customTokens];

  for (const def of allDefinitions) {
    const lightVal = tokens.light[def.cssVar];
    const darkVal = tokens.dark[def.cssVar];

    if (lightVal === undefined && darkVal === undefined) continue;

    // Simple strip of `--` for pure name. 
    // e.g. "--primary-foreground" -> "primary-foreground"
    const cleanName = def.cssVar.replace(/^--/, "");
    const folder = GROUP_FOLDERS[def.group] || "misc";

    const lightFigmaVal = lightVal !== undefined ? formatFigmaValue(def.type, lightVal) : undefined;
    const darkFigmaVal = darkVal !== undefined ? formatFigmaValue(def.type, darkVal) : lightFigmaVal;

    variables.push({
      name: `${folder}/${cleanName}`,
      type: getFigmaType(def.type),
      description: def.description,
      valuesByMode: {
        light: lightFigmaVal,
        dark: darkFigmaVal,
      },
    });
  }

  return JSON.stringify({
    collections: [
      {
        name: "Theme Studio",
        modes: ["light", "dark"],
        variables
      }
    ]
  }, null, 2);
}
