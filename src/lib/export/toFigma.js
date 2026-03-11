"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToFigma = exportToFigma;
const colorUtils_1 = require("../colorUtils");
const defaults_1 = require("../tokens/defaults");
const GROUP_FOLDERS = {
    "semantic-colors": "colors",
    "extended-palette": "colors",
    radius: "radius",
    shadows: "shadows",
    spacing: "spacing",
    typography: "typography",
    custom: "custom",
};
function formatFigmaValue(type, value) {
    if (type === "color" && (0, colorUtils_1.isHSLValue)(value)) {
        return (0, colorUtils_1.hslToRgbFloat)(value);
    }
    if (type === "radius" || type === "spacing" || type === "fontSize" || type === "lineHeight") {
        // Treat as FLOAT
        if (typeof value === "string" && value.includes("rem")) {
            return (0, colorUtils_1.remToPx)(value);
        }
        const num = parseFloat(String(value));
        return isNaN(num) ? value : num;
    }
    return String(value);
}
function getFigmaType(type) {
    if (type === "color")
        return "COLOR";
    if (type === "radius" || type === "spacing" || type === "fontSize" || type === "lineHeight")
        return "FLOAT";
    return "STRING";
}
function exportToFigma(tokens, customTokens) {
    const variables = [];
    const allDefinitions = [...defaults_1.TOKEN_DEFINITIONS, ...customTokens];
    for (const def of allDefinitions) {
        const lightVal = tokens.light[def.cssVar];
        const darkVal = tokens.dark[def.cssVar];
        if (lightVal === undefined && darkVal === undefined)
            continue;
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
    return JSON.stringify(variables, null, 2);
}
