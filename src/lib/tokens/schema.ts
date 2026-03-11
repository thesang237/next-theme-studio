export interface HSLValue {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export type TokenValue = HSLValue | string | number;

export type TokenType =
  | "color"
  | "radius"
  | "spacing"
  | "fontSize"
  | "fontFamily"
  | "fontWeight"
  | "lineHeight"
  | "shadow"
  | "custom";

export type TokenGroup =
  | "semantic-colors"
  | "extended-palette"
  | "radius"
  | "typography"
  | "shadows"
  | "spacing"
  | "custom";

export interface Token {
  id: string;
  cssVar: string;
  label: string;
  description: string;
  type: TokenType;
  group: TokenGroup;
  supportsAlpha: boolean;
  editable: boolean;
}

export interface CustomToken extends Token {
  type: "custom";
  group: "custom";
}

export type TokenMap = Record<string, TokenValue>;

export interface ThemeTokens {
  light: TokenMap;
  dark: TokenMap;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  tokens: ThemeTokens;
}

export interface ThemeSnapshot {
  tokens: ThemeTokens;
  customTokens: CustomToken[];
  timestamp: number;
}
