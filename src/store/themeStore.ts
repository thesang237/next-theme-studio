import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeTokens, CustomToken, ThemeSnapshot, TokenValue } from "@/lib/tokens/schema";
import { DEFAULT_TOKENS } from "@/lib/tokens/defaults";
import { PRESETS } from "@/lib/tokens/presets";

export interface ThemeStore {
  // ── State ──
  tokens: ThemeTokens;
  customTokens: CustomToken[];
  activeMode: "light" | "dark";
  activePreset: string | null;
  history: ThemeSnapshot[];
  historyIndex: number;

  // ── Token Actions ──
  setToken: (mode: "light" | "dark", cssVar: string, value: TokenValue) => void;
  setTokenBothModes: (cssVar: string, lightValue: TokenValue, darkValue: TokenValue) => void;
  resetToken: (cssVar: string) => void;
  resetAll: () => void;

  // ── Custom Token Actions ──
  addCustomToken: (token: Omit<CustomToken, "id">) => void;
  updateCustomToken: (id: string, updates: Partial<CustomToken>) => void;
  removeCustomToken: (id: string) => void;

  // ── Preset Actions ──
  applyPreset: (presetId: string) => void;

  // ── Mode Actions ──
  setActiveMode: (mode: "light" | "dark") => void;

  // ── History ──
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  pushHistory: () => void;

  // ── Import/Export ──
  importTokens: (json: string) => void;
}

const MAX_HISTORY = 50;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      tokens: JSON.parse(JSON.stringify(DEFAULT_TOKENS)),
      customTokens: [],
      activeMode: "light",
      activePreset: "default",
      history: [],
      historyIndex: -1,
      canUndo: false,
      canRedo: false,

      // -- History --
      pushHistory: () => {
        set((state) => {
          const snapshot: ThemeSnapshot = {
            tokens: JSON.parse(JSON.stringify(state.tokens)),
            customTokens: JSON.parse(JSON.stringify(state.customTokens)),
            timestamp: Date.now(),
          };

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(snapshot);

          if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
          }

          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
            canUndo: newHistory.length > 0,
            canRedo: false,
          };
        });
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex <= 0) return state;

          const newIndex = state.historyIndex - 1;
          const snapshot = state.history[newIndex];

          return {
            tokens: JSON.parse(JSON.stringify(snapshot.tokens)),
            customTokens: JSON.parse(JSON.stringify(snapshot.customTokens)),
            historyIndex: newIndex,
            canUndo: newIndex > 0,
            canRedo: true,
            activePreset: null,
          };
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;

          const newIndex = state.historyIndex + 1;
          const snapshot = state.history[newIndex];

          return {
            tokens: JSON.parse(JSON.stringify(snapshot.tokens)),
            customTokens: JSON.parse(JSON.stringify(snapshot.customTokens)),
            historyIndex: newIndex,
            canUndo: true,
            canRedo: newIndex < state.history.length - 1,
            activePreset: null,
          };
        });
      },

      // -- Token Actions --
      setToken: (mode, cssVar, value) => {
        get().pushHistory();
        set((state) => ({
          tokens: {
            ...state.tokens,
            [mode]: {
              ...state.tokens[mode],
              [cssVar]: value,
            },
          },
          activePreset: null,
        }));
      },

      setTokenBothModes: (cssVar, lightValue, darkValue) => {
        get().pushHistory();
        set((state) => ({
          tokens: {
            light: { ...state.tokens.light, [cssVar]: lightValue },
            dark: { ...state.tokens.dark, [cssVar]: darkValue },
          },
          activePreset: null,
        }));
      },

      resetToken: (cssVar) => {
        get().pushHistory();
        set((state) => {
          const newTokens = {
            light: { ...state.tokens.light },
            dark: { ...state.tokens.dark }
          };

          if (DEFAULT_TOKENS.light[cssVar] !== undefined) {
             newTokens.light[cssVar] = DEFAULT_TOKENS.light[cssVar];
          } else {
             delete newTokens.light[cssVar];
          }

          if (DEFAULT_TOKENS.dark[cssVar] !== undefined) {
             newTokens.dark[cssVar] = DEFAULT_TOKENS.dark[cssVar];
          } else {
             delete newTokens.dark[cssVar];
          }

          return { tokens: newTokens, activePreset: null };
        });
      },

      resetAll: () => {
        get().pushHistory();
        set(() => ({
          tokens: JSON.parse(JSON.stringify(DEFAULT_TOKENS)),
          customTokens: [],
          activePreset: "default",
        }));
      },

      // -- Custom Token Actions --
      addCustomToken: (token) => {
        get().pushHistory();
        set((state) => {
          const id = `custom-${Date.now()}`;
          const newToken: CustomToken = { ...token, id, type: "custom", group: "custom" };
          return {
            customTokens: [...state.customTokens, newToken],
            tokens: {
               light: { ...state.tokens.light, [token.cssVar]: "" }, // Optional: Seed empty or omit till used
               dark: { ...state.tokens.dark, [token.cssVar]: "" }
            }
          };
        });
      },

      updateCustomToken: (id, updates) => {
        get().pushHistory();
        set((state) => {
          const customTokenIndex = state.customTokens.findIndex((t) => t.id === id);
          if (customTokenIndex === -1) return state;

          const oldToken = state.customTokens[customTokenIndex];
          const newCustomTokens = [...state.customTokens];
          newCustomTokens[customTokenIndex] = { ...oldToken, ...updates, type: "custom", group: "custom" };

          const newTokens = {
             light: { ...state.tokens.light },
             dark: { ...state.tokens.dark }
          };

          // Migrate keys if cssVar changed
          if (updates.cssVar && updates.cssVar !== oldToken.cssVar) {
             const lightVal = newTokens.light[oldToken.cssVar];
             const darkVal = newTokens.dark[oldToken.cssVar];
             delete newTokens.light[oldToken.cssVar];
             delete newTokens.dark[oldToken.cssVar];
             if (lightVal !== undefined) newTokens.light[updates.cssVar] = lightVal;
             if (darkVal !== undefined) newTokens.dark[updates.cssVar] = darkVal;
          }

          return { customTokens: newCustomTokens, tokens: newTokens };
        });
      },

      removeCustomToken: (id) => {
        get().pushHistory();
        set((state) => {
          const tokenToRemove = state.customTokens.find((t) => t.id === id);
          if (!tokenToRemove) return state;

          const newTokens = {
             light: { ...state.tokens.light },
             dark: { ...state.tokens.dark }
          };

          delete newTokens.light[tokenToRemove.cssVar];
          delete newTokens.dark[tokenToRemove.cssVar];

          return {
            customTokens: state.customTokens.filter((t) => t.id !== id),
            tokens: newTokens
          };
        });
      },

      // -- Preset Actions --
      applyPreset: (presetId) => {
        const preset = PRESETS.find((p) => p.id === presetId);
        if (!preset) return;
        
        get().pushHistory();
        set((state) => {
          const newTokens = {
             light: { ...preset.tokens.light },
             dark: { ...preset.tokens.dark }
          };
          
          // Carry over custom tokens
          state.customTokens.forEach(ct => {
             if (state.tokens.light[ct.cssVar] !== undefined) newTokens.light[ct.cssVar] = state.tokens.light[ct.cssVar];
             if (state.tokens.dark[ct.cssVar] !== undefined) newTokens.dark[ct.cssVar] = state.tokens.dark[ct.cssVar];
          });

          return {
            tokens: newTokens,
            activePreset: presetId,
          };
        });
      },

      // -- Mode Actions --
      setActiveMode: (mode) => set({ activeMode: mode }),

      // -- Import --
      importTokens: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr);
          
          if (!parsed.tokens || typeof parsed.tokens !== 'object' || !parsed.tokens.light || !parsed.tokens.dark) {
            throw new Error("Invalid theme JSON: missing dark mode tokens");
          }

          if (parsed.customTokens && !Array.isArray(parsed.customTokens)) {
            throw new Error("Invalid theme JSON: customTokens must be an array");
          }

          get().pushHistory();
          set({
            tokens: parsed.tokens,
            customTokens: parsed.customTokens || [],
            activePreset: null,
          });
        } catch (error: any) {
          if (error.message.startsWith("Invalid theme JSON")) {
             throw error;
          }
          throw new Error(`Invalid theme JSON: ${error.message}`);
        }
      },
    }),
    {
      name: "theme-studio-v1",
      partialize: (state) => ({ 
        tokens: state.tokens, 
        customTokens: state.customTokens,
        activeMode: state.activeMode,
        activePreset: state.activePreset
      }),
    }
  )
);
