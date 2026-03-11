import { ThemeTokens, CustomToken, TokenValue } from "../tokens/schema";
import { hslToCssString, isHSLValue } from "../colorUtils";
import { TOKEN_DEFINITIONS } from "../tokens/defaults";

function formatValue(value: TokenValue | undefined): string {
  if (value === undefined) return "";
  if (isHSLValue(value)) return hslToCssString(value);
  return String(value);
}

export function exportToCodebase(tokens: ThemeTokens, customTokens: CustomToken[]): string {
  const result: { light: Record<string, string>; dark: Record<string, string> } = {
    light: {},
    dark: {},
  };

  // Standard tokens from registry first
  for (const def of TOKEN_DEFINITIONS) {
    const lightVal = tokens.light[def.cssVar];
    if (lightVal !== undefined) result.light[def.cssVar] = formatValue(lightVal);
    
    const darkVal = tokens.dark[def.cssVar];
    if (darkVal !== undefined) result.dark[def.cssVar] = formatValue(darkVal);
  }

  // Then custom tokens
  for (const custom of customTokens) {
    const lightVal = tokens.light[custom.cssVar];
    if (lightVal !== undefined) result.light[custom.cssVar] = formatValue(lightVal);

    const darkVal = tokens.dark[custom.cssVar];
    if (darkVal !== undefined) result.dark[custom.cssVar] = formatValue(darkVal);
  }

  return JSON.stringify(result, null, 2);
}
