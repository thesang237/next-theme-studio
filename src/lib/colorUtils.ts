import { HSLValue, TokenValue } from "./tokens/schema";

/**
 * Returns "#rrggbb" or "#rrggbbaa" if alpha present.
 * Example input: { h: 222, s: 47, l: 11 } -> "#0f172a"
 * Example input: { h: 222, s: 47, l: 11, a: 0.5 } -> "#0f172a80"
 */
export function hslToHex(hsl: HSLValue): string {
  let { h, s, l } = hsl;
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  let hex = "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  
  if (hsl.a !== undefined) {
    const alphaHex = Math.round(hsl.a * 255).toString(16).padStart(2, "0");
    hex += alphaHex;
  }
  
  return hex;
}

/**
 * Accepts "#rgb", "#rrggbb", "#rrggbbaa". Throws descriptive error on invalid input.
 * Example input: "#0f172a" -> { h: 222, s: 47, l: 11 }
 */
export function hexToHsl(hex: string): HSLValue {
  const shortRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
  hex = hex.replace(shortRegex, (_, r, g, b, a) => {
    return r + r + g + g + b + b + (a ? a + a : "");
  });

  const exactRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
  const result = exactRegex.exec(hex);
  
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  const aStr = result[4];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const hsl: HSLValue = {
    h: Math.round(h * 360),
    s: Math.round(s * 100 * 10) / 10,
    l: Math.round(l * 100 * 10) / 10,
  };

  if (aStr) {
    hsl.a = Math.round((parseInt(aStr, 16) / 255) * 100) / 100;
  }

  return hsl;
}

/**
 * Returns r, g, b, a in range 0–1 (for Figma Variables format).
 * Example input: { h: 222, s: 47, l: 11 } -> { r: 0.0588, g: 0.0902, b: 0.1647, a: 1 }
 */
export function hslToRgbFloat(hsl: HSLValue): { r: number; g: number; b: number; a: number } {
  let { h, s, l } = hsl;
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(f(0) * 10000) / 10000,
    g: Math.round(f(8) * 10000) / 10000,
    b: Math.round(f(4) * 10000) / 10000,
    a: hsl.a !== undefined ? hsl.a : 1,
  };
}

/**
 * Returns "H S% L%" (shadcn format, no hsl() wrapper).
 * Example: { h: 222, s: 47, l: 11 } -> "222 47% 11%"
 */
export function hslToCssString(hsl: HSLValue): string {
  const base = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
  return hsl.a !== undefined ? `${base} / ${hsl.a}` : base;
}

/**
 * Parses "H S% L%" back to HSLValue.
 * Example input: "222 47% 11%" -> { h: 222, s: 47, l: 11 }
 */
export function cssStringToHsl(value: string): HSLValue {
  const parts = value.split("/");
  const colorPart = parts[0].trim();
  const alphaPart = parts[1]?.trim();

  // Strip non-numeric/non-dot characters (like % or deg) except spaces
  const cleanStr = colorPart.replace(/[^\d.\s-]/g, "");
  const [hStr, sStr, lStr] = cleanStr.split(/\s+/).filter(Boolean);

  const hsl: HSLValue = {
    h: parseFloat(hStr) || 0,
    s: parseFloat(sStr) || 0,
    l: parseFloat(lStr) || 0,
  };

  if (alphaPart) {
    hsl.a = parseFloat(alphaPart);
  }

  return hsl;
}

/**
 * Assumes 16px base. "0.5rem" -> 8, 0.5 -> 8
 */
export function remToPx(rem: string | number): number {
  if (typeof rem === "number") return rem * 16;
  const num = parseFloat(rem.replace(/[^\d.-]/g, ""));
  return isNaN(num) ? 0 : num * 16;
}

/**
 * Type guard for HSLValue.
 */
export function isHSLValue(value: TokenValue): value is HSLValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "h" in value &&
    "s" in value &&
    "l" in value
  );
}
