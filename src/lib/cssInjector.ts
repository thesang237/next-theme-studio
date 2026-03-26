import { ThemeTokens, CustomToken, TokenValue } from "./tokens/schema";
import { hslToCssString, isHSLValue } from "./colorUtils";

function formatTokenValue(value: TokenValue): string {
  if (isHSLValue(value)) {
    return hslToCssString(value);
  }
  return String(value);
}

/**
 * Injects theme tokens as CSS custom properties directly onto the
 * #theme-preview element's style attribute.
 * This approach bypasses all CSS specificity issues since inline styles
 * on the element always win.
 */
export function injectTokens(
  tokens: ThemeTokens,
  customTokens: CustomToken[],
  activeMode: "light" | "dark"
): void {
  if (typeof document === "undefined") return; // SSR guard

  const previewEl = document.getElementById("theme-preview");
  const bodyEl = document.body;

  const applyProperty = (key: string, value: string) => {
    if (previewEl) previewEl.style.setProperty(key, value);
    if (bodyEl) bodyEl.style.setProperty(key, value);
  };

  const tokenMap = tokens[activeMode];

  // Collect all CSS variable assignments for the current mode
  for (const [cssVar, val] of Object.entries(tokenMap)) {
    if (val !== undefined && val !== "") {
      applyProperty(cssVar, formatTokenValue(val));
    }
  }

  // Custom tokens
  for (const token of customTokens) {
    const mappedVal = tokenMap[token.cssVar];
    if (mappedVal !== undefined && mappedVal !== "") {
      applyProperty(token.cssVar, formatTokenValue(mappedVal));
    }
  }
}

export function createInjector(): (
  tokens: ThemeTokens,
  customTokens: CustomToken[],
  activeMode: "light" | "dark"
) => void {
  return (tokens, customTokens, activeMode) => {
    injectTokens(tokens, customTokens, activeMode);
  };
}
