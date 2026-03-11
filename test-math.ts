import { hslToHex, hexToHsl, hslToCssString, cssStringToHsl, remToPx, hslToRgbFloat } from "./src/lib/colorUtils";
import { exportToCss } from "./src/lib/export/toCss";
import { DEFAULT_TOKENS } from "./src/lib/tokens/defaults";

console.log("--- COLOR MATH ---");
console.log("hslToHex({ h: 0, s: 0, l: 100 }) ->", hslToHex({ h: 0, s: 0, l: 100 }));
console.log("hslToHex({ h: 0, s: 0, l: 0 }) ->", hslToHex({ h: 0, s: 0, l: 0 }));
console.log("hslToHex({ h: 222, s: 47, l: 11 }) ->", hslToHex({ h: 222, s: 47, l: 11 }));
console.log("hexToHsl('#ffffff') ->", hexToHsl("#ffffff"));
console.log("hexToHsl('#000000') ->", hexToHsl("#000000"));
console.log("hslToCssString({ h: 222, s: 47, l: 11 }) ->", hslToCssString({ h: 222, s: 47, l: 11 }));
console.log("cssStringToHsl('222 47% 11%') ->", cssStringToHsl("222 47% 11%"));
console.log("remToPx('0.5rem') ->", remToPx("0.5rem"));
console.log("remToPx('1rem') ->", remToPx("1rem"));
console.log("remToPx(1.5) ->", remToPx(1.5));

console.log("\n--- EXPORT MATH ---");
console.log("hslToRgbFloat({ h: 240, s: 5.9, l: 10 }) ->", hslToRgbFloat({ h: 240, s: 5.9, l: 10 }));

console.log("\n--- CSS EXPORT HEAD ---");
const cssStr = exportToCss(DEFAULT_TOKENS, []);
console.log(cssStr.split('\\n').slice(0, 5).join('\\n'));
