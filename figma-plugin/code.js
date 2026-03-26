// Theme Studio — Figma Plugin (Main Thread)
// Imports design tokens as Figma Variables AND generates shadcn/ui components
// bound to those variables (or default Zinc theme when no JSON is provided).

figma.showUI(__html__, { width: 480, height: 620, title: "Theme Studio" });

// ─── Default Theme (shadcn/ui Zinc · Light) ──────────────────
const DEFAULT_THEME = {
  background:            { r: 1,     g: 1,     b: 1     },
  foreground:            { r: 0.055, g: 0.055, b: 0.067 },
  card:                  { r: 1,     g: 1,     b: 1     },
  cardForeground:        { r: 0.055, g: 0.055, b: 0.067 },
  primary:               { r: 0.098, g: 0.098, b: 0.106 },
  primaryForeground:     { r: 0.976, g: 0.976, b: 0.98  },
  secondary:             { r: 0.945, g: 0.945, b: 0.953 },
  secondaryForeground:   { r: 0.098, g: 0.098, b: 0.106 },
  muted:                 { r: 0.945, g: 0.945, b: 0.953 },
  mutedForeground:       { r: 0.443, g: 0.443, b: 0.478 },
  accent:                { r: 0.945, g: 0.945, b: 0.953 },
  accentForeground:      { r: 0.098, g: 0.098, b: 0.106 },
  destructive:           { r: 0.937, g: 0.267, b: 0.267 },
  destructiveForeground: { r: 0.976, g: 0.976, b: 0.98  },
  border:                { r: 0.898, g: 0.898, b: 0.914 },
  input:                 { r: 0.898, g: 0.898, b: 0.914 },
  ring:                  { r: 0.098, g: 0.098, b: 0.106 },
};

const RADIUS    = 6;
const RADIUS_XL = 12;

const FONT          = { family: "Inter", style: "Regular"   };
const FONT_MEDIUM   = { family: "Inter", style: "Medium"    };
const FONT_SEMIBOLD = { family: "Inter", style: "Semi Bold" };
const FONT_BOLD     = { family: "Inter", style: "Bold"      };

// ─── Key normalisation for JSON → THEME mapping ──────────────
// Handles camelCase, kebab-case, snake_case, and path prefixes like "colors/primary"
const NORM_MAP = (() => {
  const m = {};
  const keys = Object.keys(DEFAULT_THEME);
  for (const k of keys) m[k.toLowerCase().replace(/[-_\s]/g, "")] = k;
  return m;
})();

function normalizeVarName(name) {
  const base = name.split("/").pop().split(".").pop();
  return base.toLowerCase().replace(/[-_\s]/g, "");
}

// ─── Rendering helpers ────────────────────────────────────────

// ctx = { theme: { [key]: {r,g,b} }, vars: { [key]: Variable } }
// Returns a fills/strokes array, binding to a Figma variable when one exists.
function bound(themeKey, ctx) {
  const color    = ctx.theme[themeKey];
  const variable = ctx.vars[themeKey];
  if (!color) return [];
  if (variable) {
    const paint = { type: "SOLID", color };
    return [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  }
  return [{ type: "SOLID", color }];
}

function setAL(frame, dir, pad, gap) {
  frame.layoutMode    = dir;
  frame.paddingTop    = pad.t || 0;
  frame.paddingBottom = pad.b || 0;
  frame.paddingLeft   = pad.l || 0;
  frame.paddingRight  = pad.r || 0;
  frame.itemSpacing   = gap;
  frame.counterAxisSizingMode = "AUTO";
  frame.primaryAxisSizingMode = "AUTO";
}

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync(FONT),
    figma.loadFontAsync(FONT_MEDIUM),
    figma.loadFontAsync(FONT_SEMIBOLD),
    figma.loadFontAsync(FONT_BOLD),
  ]);
}

function txt(content, size, font, colorKey, ctx, lh) {
  const t = figma.createText();
  t.characters = content;
  t.fontSize   = size;
  t.fontName   = font;
  t.fills      = bound(colorKey, ctx);
  t.lineHeight = { value: lh || size * 1.5, unit: "PIXELS" };
  return t;
}

function wrapComponentSet(variants, name) {
  const cs = figma.combineAsVariants(variants, figma.currentPage);
  cs.name = name;
  cs.fills = [];
  cs.layoutMode         = "HORIZONTAL";
  cs.layoutWrap         = "WRAP";
  cs.itemSpacing        = 16;
  cs.counterAxisSpacing = 16;
  cs.paddingTop = cs.paddingBottom = cs.paddingLeft = cs.paddingRight = 24;
  cs.primaryAxisSizingMode = "AUTO";
  cs.counterAxisSizingMode = "AUTO";
  return cs;
}

// ─── BUTTON ──────────────────────────────────────────────────
// default: h-10 px-4 py-2 | sm: h-9 px-3 | lg: h-11 px-8 | icon: h-10 w-10

function mkButton(variant, size, ctx) {
  const S = {
    default: { h: 40, px: 16 },
    sm:      { h: 36, px: 12 },
    lg:      { h: 44, px: 32 },
    icon:    { h: 40, px: 12, w: 40 },
  }[size];

  const V = {
    default:     { bgKey: "primary",     fgKey: "primaryForeground",    strokeKey: null    },
    destructive: { bgKey: "destructive", fgKey: "destructiveForeground", strokeKey: null   },
    outline:     { bgKey: "background",  fgKey: "foreground",            strokeKey: "input" },
    secondary:   { bgKey: "secondary",   fgKey: "secondaryForeground",   strokeKey: null    },
    ghost:       { bgKey: null,          fgKey: "foreground",            strokeKey: null    },
    link:        { bgKey: null,          fgKey: "primary",               strokeKey: null    },
  }[variant];

  const c = figma.createComponent();
  c.name = `Variant=${variant}, Size=${size}`;

  if (size === "icon") {
    c.resize(S.w, S.h);
    c.layoutMode             = "HORIZONTAL";
    c.primaryAxisAlignItems  = "CENTER";
    c.counterAxisAlignItems  = "CENTER";
    c.primaryAxisSizingMode  = "FIXED";
    c.counterAxisSizingMode  = "FIXED";
  } else {
    const py = Math.round((S.h - 21) / 2); // 14px * 1.5 line-height = 21
    setAL(c, "HORIZONTAL", { t: py, b: py, l: S.px, r: S.px }, 8);
    c.primaryAxisAlignItems = "CENTER";
    c.counterAxisAlignItems = "CENTER";
    c.counterAxisSizingMode = "FIXED";
    c.resize(c.width, S.h);
  }

  c.fills = V.bgKey ? bound(V.bgKey, ctx) : [];
  if (V.strokeKey) { c.strokes = bound(V.strokeKey, ctx); c.strokeWeight = 1; c.strokeAlign = "INSIDE"; }
  if (variant !== "link") c.cornerRadius = RADIUS;

  if (size === "icon") {
    const ico = figma.createFrame();
    ico.name = "Icon"; ico.resize(16, 16);
    ico.fills = bound(V.fgKey, ctx); ico.cornerRadius = 2;
    c.appendChild(ico);
  } else {
    const labels = { default: "Button", destructive: "Destructive", outline: "Outline", secondary: "Secondary", ghost: "Ghost", link: "Link" };
    const lbl = txt(labels[variant], 14, FONT_MEDIUM, V.fgKey, ctx);
    if (variant === "link") lbl.textDecoration = "UNDERLINE";
    c.appendChild(lbl);
  }

  return c;
}

function genButtons(ctx) {
  const parts = [];
  for (const v of ["default", "destructive", "outline", "secondary", "ghost", "link"]) {
    for (const s of ["default", "sm", "lg", "icon"]) {
      if (v === "link" && s === "icon") continue;
      parts.push(mkButton(v, s, ctx));
    }
  }
  return wrapComponentSet(parts, "Button");
}

// ─── INPUT ───────────────────────────────────────────────────
// h-10 px-3 py-2 text-sm rounded-md border border-input

function mkInput(state, ctx) {
  const c = figma.createComponent();
  c.name = `State=${state}`;
  setAL(c, "VERTICAL", { t: 0, b: 0, l: 0, r: 0 }, 8);

  c.appendChild(txt("Email", 14, FONT_MEDIUM, "foreground", ctx));

  const field = figma.createFrame();
  field.name = "Input";
  setAL(field, "HORIZONTAL", { t: 8, b: 8, l: 12, r: 12 }, 0);
  field.resize(320, 40);
  field.primaryAxisSizingMode  = "FIXED";
  field.counterAxisSizingMode  = "FIXED";
  field.fills        = bound("background", ctx);
  field.strokes      = bound(state === "focus" ? "ring" : "input", ctx);
  field.strokeWeight = state === "focus" ? 2 : 1;
  field.strokeAlign  = "INSIDE";
  field.cornerRadius = RADIUS;
  field.counterAxisAlignItems = "CENTER";

  field.appendChild(txt("m@example.com", 14, FONT, state === "filled" ? "foreground" : "mutedForeground", ctx));
  c.appendChild(field);

  if (state === "disabled") field.opacity = 0.5;

  if (state === "error") {
    field.strokes = bound("destructive", ctx);
    c.appendChild(txt("Please enter a valid email.", 14, FONT, "destructive", ctx));
  }

  return c;
}

function genInputs(ctx) {
  return wrapComponentSet(["default", "filled", "focus", "disabled", "error"].map(s => mkInput(s, ctx)), "Input");
}

// ─── CARD ────────────────────────────────────────────────────
// rounded-xl border bg-card shadow-sm

function mkCard(variant, ctx) {
  const c = figma.createComponent();
  c.name = `Variant=${variant}`;
  setAL(c, "VERTICAL", { t: 0, b: 0, l: 0, r: 0 }, 0);
  c.resize(380, 10);
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "FIXED";
  c.fills        = bound("card", ctx);
  c.strokes      = bound("border", ctx);
  c.strokeWeight = 1;
  c.strokeAlign  = "INSIDE";
  c.cornerRadius = RADIUS_XL;

  // Header
  const hdr = figma.createFrame();
  hdr.name = "CardHeader";
  setAL(hdr, "VERTICAL", { t: 24, b: 24, l: 24, r: 24 }, 6);
  hdr.fills = []; hdr.layoutAlign = "STRETCH";

  const titles = {
    simple:         ["Card Title",     "Card Description"],
    "with-form":    ["Create project", "Deploy your new project in one-click."],
    "with-content": ["Notifications",  "You have 3 unread messages."],
  };
  const [tt, td] = titles[variant];
  hdr.appendChild(txt(tt, 24, FONT_SEMIBOLD, "cardForeground", ctx, 24));
  hdr.appendChild(txt(td, 14, FONT, "mutedForeground", ctx));
  c.appendChild(hdr);

  // Content
  const cnt = figma.createFrame();
  cnt.name = "⬡ CardContent";
  setAL(cnt, "VERTICAL", { t: 0, b: variant === "with-form" ? 0 : 24, l: 24, r: 24 }, 8);
  cnt.fills = []; cnt.layoutAlign = "STRETCH";

  if (variant === "with-form") {
    cnt.appendChild(txt("Name", 14, FONT_MEDIUM, "foreground", ctx));
    const inp = figma.createFrame();
    inp.name = "NameInput";
    setAL(inp, "HORIZONTAL", { t: 8, b: 8, l: 12, r: 12 }, 0);
    inp.resize(332, 40);
    inp.primaryAxisSizingMode = "FIXED"; inp.counterAxisSizingMode = "FIXED";
    inp.fills = bound("background", ctx); inp.strokes = bound("input", ctx);
    inp.strokeWeight = 1; inp.strokeAlign = "INSIDE";
    inp.cornerRadius = RADIUS; inp.layoutAlign = "STRETCH";
    inp.counterAxisAlignItems = "CENTER";
    inp.appendChild(txt("Name of your project", 14, FONT, "mutedForeground", ctx));
    cnt.appendChild(inp);

    cnt.appendChild(txt("Framework", 14, FONT_MEDIUM, "foreground", ctx));
    const sel = figma.createFrame();
    sel.name = "Select";
    setAL(sel, "HORIZONTAL", { t: 8, b: 8, l: 12, r: 12 }, 0);
    sel.resize(332, 40);
    sel.primaryAxisSizingMode = "FIXED"; sel.counterAxisSizingMode = "FIXED";
    sel.fills = bound("background", ctx); sel.strokes = bound("input", ctx);
    sel.strokeWeight = 1; sel.strokeAlign = "INSIDE";
    sel.cornerRadius = RADIUS; sel.layoutAlign = "STRETCH";
    sel.counterAxisAlignItems = "CENTER";
    sel.appendChild(txt("Select", 14, FONT, "mutedForeground", ctx));
    cnt.appendChild(sel);
  } else {
    const area = figma.createFrame();
    area.name = "⬡ Content";
    setAL(area, "VERTICAL", { t: 0, b: 0, l: 0, r: 0 }, 8);
    area.layoutAlign = "STRETCH";
    area.primaryAxisSizingMode = "AUTO";
    area.fills = [];
    const placeholder = figma.createFrame();
    placeholder.name = "Placeholder";
    placeholder.resize(332, 64);
    placeholder.primaryAxisSizingMode = "FIXED";
    placeholder.counterAxisSizingMode = "FIXED";
    placeholder.layoutAlign = "STRETCH";
    placeholder.fills = bound("muted", ctx);
    placeholder.cornerRadius = RADIUS;
    area.appendChild(placeholder);
    cnt.appendChild(area);
  }
  c.appendChild(cnt);

  // Footer (with-form only)
  if (variant === "with-form") {
    const ftr = figma.createFrame();
    ftr.name = "CardFooter";
    setAL(ftr, "HORIZONTAL", { t: 24, b: 24, l: 24, r: 24 }, 8);
    ftr.fills = []; ftr.layoutAlign = "STRETCH";
    ftr.primaryAxisSizingMode = "FIXED";

    const cb = figma.createFrame(); cb.name = "Cancel";
    setAL(cb, "HORIZONTAL", { t: 10, b: 10, l: 16, r: 16 }, 0);
    cb.fills = bound("background", ctx); cb.strokes = bound("input", ctx);
    cb.strokeWeight = 1; cb.strokeAlign = "INSIDE"; cb.cornerRadius = RADIUS;
    cb.primaryAxisAlignItems = "CENTER"; cb.counterAxisAlignItems = "CENTER";
    cb.layoutGrow = 1;
    cb.appendChild(txt("Cancel", 14, FONT_MEDIUM, "foreground", ctx));
    ftr.appendChild(cb);

    const db = figma.createFrame(); db.name = "Deploy";
    setAL(db, "HORIZONTAL", { t: 10, b: 10, l: 16, r: 16 }, 0);
    db.fills = bound("primary", ctx); db.cornerRadius = RADIUS;
    db.primaryAxisAlignItems = "CENTER"; db.counterAxisAlignItems = "CENTER";
    db.layoutGrow = 1;
    db.appendChild(txt("Deploy", 14, FONT_MEDIUM, "primaryForeground", ctx));
    ftr.appendChild(db);

    c.appendChild(ftr);
  }

  return c;
}

function genCards(ctx) {
  return wrapComponentSet(["simple", "with-form", "with-content"].map(v => mkCard(v, ctx)), "Card");
}

// ─── BADGE ───────────────────────────────────────────────────
// rounded-full px-2.5 py-0.5 text-xs font-semibold

function mkBadge(variant, ctx) {
  const V = {
    default:     { bgKey: "primary",     fgKey: "primaryForeground",    strokeKey: null    },
    secondary:   { bgKey: "secondary",   fgKey: "secondaryForeground",  strokeKey: null    },
    destructive: { bgKey: "destructive", fgKey: "destructiveForeground", strokeKey: null   },
    outline:     { bgKey: null,          fgKey: "foreground",           strokeKey: "border" },
  }[variant];

  const c = figma.createComponent();
  c.name = `Variant=${variant}`;
  setAL(c, "HORIZONTAL", { t: 2, b: 2, l: 10, r: 10 }, 0);
  c.primaryAxisAlignItems = "CENTER";
  c.counterAxisAlignItems = "CENTER";
  c.cornerRadius = 9999;
  c.fills = V.bgKey ? bound(V.bgKey, ctx) : [];
  if (V.strokeKey) { c.strokes = bound(V.strokeKey, ctx); c.strokeWeight = 1; c.strokeAlign = "INSIDE"; }

  const labels = { default: "Badge", secondary: "Secondary", destructive: "Destructive", outline: "Outline" };
  c.appendChild(txt(labels[variant], 12, FONT_SEMIBOLD, V.fgKey, ctx, 16));
  return c;
}

function genBadges(ctx) {
  return wrapComponentSet(["default", "secondary", "destructive", "outline"].map(v => mkBadge(v, ctx)), "Badge");
}

// ─── Sheet wrapper ────────────────────────────────────────────

function buildSheet(sets, ctx) {
  const f = figma.createFrame();
  f.name = "Theme Studio · Component Kit";
  setAL(f, "VERTICAL", { t: 48, b: 48, l: 48, r: 48 }, 48);
  f.fills = bound("background", ctx);

  const usingTokens = Object.keys(ctx.vars).length > 0;
  f.appendChild(txt("Theme Studio · Component Kit", 28, FONT_BOLD, "foreground", ctx));
  f.appendChild(txt(
    usingTokens
      ? "Using your imported design tokens · Generated by Theme Studio"
      : "Default theme (Zinc) · Generated by Theme Studio",
    14, FONT, "mutedForeground", ctx
  ));

  const div = figma.createFrame();
  div.name = "Divider"; div.resize(600, 1);
  div.fills = bound("border", ctx); div.layoutAlign = "STRETCH";
  f.appendChild(div);

  for (const { label, node } of sets) {
    const sec = figma.createFrame();
    sec.name = label;
    setAL(sec, "VERTICAL", { t: 0, b: 0, l: 0, r: 0 }, 16);
    sec.fills = [];
    sec.appendChild(txt(label, 18, FONT_SEMIBOLD, "foreground", ctx));
    sec.appendChild(node);
    f.appendChild(sec);
  }
  return f;
}

// ─── JSON → theme extraction ──────────────────────────────────
// Reads COLOR variables from the JSON and overlays them on DEFAULT_THEME.
// Handles kebab-case, camelCase, snake_case, and path prefixes.

function extractThemeFromJson(data) {
  const theme = Object.assign({}, DEFAULT_THEME);
  for (const col of (data.collections || [])) {
    for (const v of (col.variables || [])) {
      if (v.type !== "COLOR") continue;
      const themeKey = NORM_MAP[normalizeVarName(v.name)];
      if (!themeKey) continue;
      const modeNames = Object.keys(v.valuesByMode || {});
      if (!modeNames.length) continue;
      const val = v.valuesByMode[modeNames[0]];
      if (val && typeof val.r === "number") {
        theme[themeKey] = { r: val.r, g: val.g, b: val.b };
      }
    }
  }
  return theme;
}

// ─── Variable import ──────────────────────────────────────────
// Creates Figma variable collections and returns:
//   results   – human-readable import summary strings
//   themeVars – { [themeKey]: Variable } for component binding

function importVariables(data) {
  if (!data.collections || !Array.isArray(data.collections)) {
    throw new Error('Invalid format: expected a "collections" array at root.');
  }

  const variableRegistry = {}; // "CollectionName/varName" → Variable
  const themeVars        = {}; // THEME key → Variable
  const results          = [];

  for (const col of data.collections) {
    if (!col.name || !Array.isArray(col.modes) || !Array.isArray(col.variables)) {
      throw new Error(`Collection "${col.name || "?"}" is missing name, modes, or variables.`);
    }

    const collection = figma.variables.createVariableCollection(col.name);
    const modeIds    = {};
    collection.renameMode(collection.modes[0].modeId, col.modes[0]);
    modeIds[col.modes[0]] = collection.modes[0].modeId;
    for (let m = 1; m < col.modes.length; m++) {
      modeIds[col.modes[m]] = collection.addMode(col.modes[m]);
    }

    let created = 0, skipped = 0;

    for (const def of col.variables) {
      if (!def.name || !def.type || !def.valuesByMode) { skipped++; continue; }
      try {
        const variable = figma.variables.createVariable(def.name, collection.id, def.type);
        if (def.description) variable.description = def.description;

        variableRegistry[col.name + "/" + def.name] = variable;

        // Register for component binding
        const themeKey = NORM_MAP[normalizeVarName(def.name)];
        if (themeKey && def.type === "COLOR") themeVars[themeKey] = variable;

        for (const modeName of Object.keys(def.valuesByMode)) {
          const modeId = modeIds[modeName];
          if (modeId === undefined) continue;
          let value = def.valuesByMode[modeName];

          // Resolve alias
          if (value !== null && typeof value === "object" &&
              typeof value.collection === "string" && !("r" in value)) {
            const target = variableRegistry[value.collection + "/" + value.name];
            if (!target) continue;
            value = figma.variables.createVariableAlias(target);
          }

          if (def.type === "FLOAT" && typeof value === "string") {
            const parsed = parseFloat(value);
            if (isNaN(parsed)) continue;
            value = parsed;
          }

          variable.setValueForMode(modeId, value);
        }
        created++;
      } catch (_) { skipped++; }
    }

    results.push(
      col.name + ": " + created + " variable" + (created !== 1 ? "s" : "") + " imported" +
      (skipped ? ", " + skipped + " skipped" : "")
    );
  }

  return { results, themeVars };
}

// ─── Plugin message handler ───────────────────────────────────

figma.ui.onmessage = async (msg) => {

  // ── Import variables only ─────────────────────────────────
  if (msg.type === "import") {
    try {
      const data = JSON.parse(msg.json);
      const { results } = importVariables(data);
      figma.ui.postMessage({ type: "import-success", results });
    } catch (err) {
      figma.ui.postMessage({ type: "error", message: err.message });
    }
    return;
  }

  // ── Generate components (+ optionally import tokens first) ─
  if (msg.type === "generate") {
    try {
      await loadFonts();

      let theme      = DEFAULT_THEME;
      let themeVars  = {};
      let importResults = null;

      if (msg.json) {
        const data = JSON.parse(msg.json);
        theme = extractThemeFromJson(data);
        const imported = importVariables(data);
        themeVars    = imported.themeVars;
        importResults = imported.results;
      }

      const ctx = { theme, vars: themeVars };
      const sel = msg.components || ["buttons", "inputs", "cards", "badges"];
      const sets = [];

      if (sel.includes("buttons")) sets.push({ label: "Button", node: genButtons(ctx) });
      if (sel.includes("inputs"))  sets.push({ label: "Input",  node: genInputs(ctx)  });
      if (sel.includes("cards"))   sets.push({ label: "Card",   node: genCards(ctx)   });
      if (sel.includes("badges"))  sets.push({ label: "Badge",  node: genBadges(ctx)  });

      const sheet = buildSheet(sets, ctx);
      const vp    = figma.viewport.center;
      sheet.x = Math.round(vp.x - sheet.width  / 2);
      sheet.y = Math.round(vp.y - sheet.height / 2);
      figma.currentPage.appendChild(sheet);
      figma.viewport.scrollAndZoomIntoView([sheet]);

      figma.ui.postMessage({ type: "generate-success", importResults });
      figma.notify(importResults
        ? "✓ Components generated with your design tokens!"
        : "✓ Components generated with default Zinc theme!"
      );
    } catch (err) {
      figma.ui.postMessage({ type: "error", message: err.message });
    }
    return;
  }

  if (msg.type === "cancel") figma.closePlugin();
};
