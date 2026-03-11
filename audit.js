"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = require("./src/lib/tokens/defaults");
const presets_1 = require("./src/lib/tokens/presets");
const themeStore_1 = require("./src/store/themeStore");
const colorUtils_1 = require("./src/lib/colorUtils");
const toCss_1 = require("./src/lib/export/toCss");
console.log("=== TYPE CONSISTENCY CHECK ===");
let check1 = true;
// Check 1: Does every Token in TOKEN_DEFINITIONS have an id that matches a key in DEFAULT_TOKENS.light?
for (const def of defaults_1.TOKEN_DEFINITIONS) {
    if (!(def.id in defaults_1.DEFAULT_TOKENS.light)) {
        console.log(`❌ Check 1 failed: Token ID '${def.id}' does not exist as a key in DEFAULT_TOKENS.light`);
        check1 = false;
    }
}
if (check1)
    console.log("✅ Check 1 passed.");
// Check 2: light and dark exact same keys
const lightKeys = Object.keys(defaults_1.DEFAULT_TOKENS.light).sort();
const darkKeys = Object.keys(defaults_1.DEFAULT_TOKENS.dark).sort();
let check2 = lightKeys.length === darkKeys.length && lightKeys.every((val, index) => val === darkKeys[index]);
console.log(check2 ? "✅ Check 2 passed." : "❌ Check 2 failed.");
// Check 3: Presets only override keys in DEFAULT_TOKENS.light
let check3 = true;
for (const preset of presets_1.PRESETS) {
    for (const key in preset.tokens.light) {
        if (!(key in defaults_1.DEFAULT_TOKENS.light)) {
            console.log(`❌ Check 3 failed: Preset '${preset.id}' overrides unknown key '${key}'`);
            check3 = false;
        }
    }
}
if (check3)
    console.log("✅ Check 3 passed.");
// Check 5: importTokens throws typed Error
console.log("\n=== STORE EDGE CASES ===");
const store = themeStore_1.useThemeStore.getState();
try {
    store.importTokens(JSON.stringify({ light: { "--primary": "240 5.9% 10%" } }));
    console.log("❌ Scenario B failed: Did not throw error.");
}
catch (e) {
    if (e.message.includes("Missing complete token maps")) {
        console.log("✅ Scenario B passed: Threw typed Error for missing tokens ->", e.message);
    }
    else {
        console.log("⚠️ Scenario B partial: Threw Error but message differs ->", e.message);
    }
}
// Scenario C
store.applyPreset("rose");
const preUndoPreset = themeStore_1.useThemeStore.getState().activePreset;
store.undo();
const postUndoPreset = themeStore_1.useThemeStore.getState().activePreset;
console.log(`Scenario C: preUndo=${preUndoPreset}, postUndo=${postUndoPreset}`);
console.log("\n=== COLOR MATH CHECK ===");
const runMath = (name, act, exp, exact = true) => {
    let pass = false;
    if (typeof act === "object" && typeof exp === "object") {
        if (Object.keys(exp).every(k => Math.abs(act[k] - exp[k]) < 0.05))
            pass = true;
    }
    else {
        pass = act === exp;
    }
    console.log(`${pass ? "✅" : "❌"} ${name} ->`, act);
};
runMath("hslToHex({ h: 0, s: 0, l: 100 })", (0, colorUtils_1.hslToHex)({ h: 0, s: 0, l: 100 }), "#ffffff");
runMath("hslToHex({ h: 0, s: 0, l: 0 })", (0, colorUtils_1.hslToHex)({ h: 0, s: 0, l: 0 }), "#000000");
runMath("hslToHex({ h: 222, s: 47, l: 11 })", (0, colorUtils_1.hslToHex)({ h: 222, s: 47, l: 11 }), "#0f172a"); // Approximate expected from hex, let's see
runMath("hexToHsl('#ffffff')", (0, colorUtils_1.hexToHsl)("#ffffff"), { h: 0, s: 0, l: 100 });
runMath("hexToHsl('#000000')", (0, colorUtils_1.hexToHsl)("#000000"), { h: 0, s: 0, l: 0 });
runMath("hslToCssString({ h: 222, s: 47, l: 11 })", (0, colorUtils_1.hslToCssString)({ h: 222, s: 47, l: 11 }), "222 47% 11%");
runMath("cssStringToHsl('222 47% 11%')", (0, colorUtils_1.cssStringToHsl)("222 47% 11%"), { h: 222, s: 47, l: 11 });
runMath("remToPx('0.5rem')", (0, colorUtils_1.remToPx)("0.5rem"), 8);
runMath("remToPx('1rem')", (0, colorUtils_1.remToPx)("1rem"), 16);
runMath("remToPx(1.5)", (0, colorUtils_1.remToPx)(1.5), 24);
console.log("\n=== EXPORT FORMAT CHECK ===");
console.log("hslToRgbFloat({ h: 240, s: 5.9, l: 10 }) ->", (0, colorUtils_1.hslToRgbFloat)({ h: 240, s: 5.9, l: 10 }));
console.log("\n=== SCENARIO A: 51 HISTORY CALLS ===");
for (let i = 0; i < 51; i++) {
    themeStore_1.useThemeStore.getState().setToken("light", "--test", i);
}
const stateAfter51 = themeStore_1.useThemeStore.getState();
console.log(`History length: ${stateAfter51.history.length}`);
console.log(`History index: ${stateAfter51.historyIndex}`);
stateAfter51.undo();
const stateAfterUndo = themeStore_1.useThemeStore.getState();
console.log(`History index after undo: ${stateAfterUndo.historyIndex}`);
console.log(`Value after undo: ${stateAfterUndo.tokens.light["--test"]}`);
console.log("\n=== CSS EXPORT HEAD ===");
console.log((0, toCss_1.exportToCss)(defaults_1.DEFAULT_TOKENS, []).split('\\n').slice(0, 5).join('\\n'));
