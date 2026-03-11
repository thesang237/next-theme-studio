const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src/lib/tokens/defaults.ts');
let content = fs.readFileSync(targetPath, 'utf8');

content = content.replace(/\{ id: "[^"]+", cssVar: "([^"]+)",/g, '{ id: "$1", cssVar: "$1",');
fs.writeFileSync(targetPath, content);
console.log("Rewrote defaults.ts ids");
