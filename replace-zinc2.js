const fs = require('fs');
const path = require('path');

const dir = 'src/components/studio';

function getFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFiles(fullPath));
    } else if (entry.isFile() && fullPath.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getFiles(dir);
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content
    // Backgrounds
    .replace(/\bbg-zinc-950(\/[0-9]+)?\b/g, 'bg-background')
    .replace(/\bbg-zinc-900(\/[0-9]+)?\b/g, 'bg-card')
    .replace(/\bbg-zinc-800(\/[0-9]+)?\b/g, 'bg-popover')
    .replace(/\bbg-zinc-700(\/[0-9]+)?\b/g, 'bg-muted')
    .replace(/\bbg-zinc-[1-6]00(\/[0-9]+)?\b/g, 'bg-muted')
    .replace(/\bhover:bg-zinc-[0-9]+(\/[0-9]+)?\b/g, 'hover:bg-accent')
    .replace(/\bdata-\[state=active\]:bg-zinc-[0-9]+(\/[0-9]+)?\b/g, 'data-[state=active]:bg-primary')
    
    // Texts
    .replace(/\btext-zinc-[123]00\b/g, 'text-foreground')
    .replace(/\btext-zinc-50\b/g, 'text-foreground')
    .replace(/\btext-zinc-[456]00\b/g, 'text-muted-foreground')
    .replace(/\btext-zinc-[789]00\b/g, 'text-muted-foreground')
    .replace(/\btext-zinc-950\b/g, 'text-foreground')
    .replace(/\bhover:text-zinc-[0-9]+\b/g, 'hover:text-accent-foreground')
    .replace(/\bdata-\[state=active\]:text-zinc-[0-9]+\b/g, 'data-[state=active]:text-primary-foreground')

    // Borders
    .replace(/\bborder-zinc-[98]00\b/g, 'border-border')
    .replace(/\bborder-zinc-[1-7]00\b/g, 'border-input')
    .replace(/\bhover:border-zinc-[0-9]+\b/g, 'hover:border-accent')
    
    // Rings
    .replace(/\bring-zinc-[0-9]+\b/g, 'ring-ring')
    .replace(/\bfocus-visible:ring-zinc-[0-9]+\b/g, 'focus-visible:ring-ring')
    
    // Stroke / Fill
    .replace(/\bstroke-zinc-[0-9]+\b/g, 'stroke-foreground')
    .replace(/\bfill-zinc-[0-9]+\b/g, 'fill-foreground');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
