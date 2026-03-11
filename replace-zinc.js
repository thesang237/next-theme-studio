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

const map = {
  'bg-zinc-950': 'bg-background',
  'bg-zinc-900': 'bg-card',
  'bg-zinc-800': 'bg-popover',
  'bg-zinc-700': 'bg-muted',
  'bg-zinc-900/50': 'bg-card/50',
  'bg-zinc-800/50': 'bg-popover/50',
  'text-zinc-100': 'text-foreground',
  'text-zinc-200': 'text-foreground',
  'text-zinc-300': 'text-foreground',
  'text-zinc-400': 'text-muted-foreground',
  'text-zinc-500': 'text-muted-foreground',
  'border-zinc-900': 'border-border',
  'border-zinc-800': 'border-border',
  'border-zinc-700': 'border-input',
  'ring-zinc-800': 'ring-ring',
  'ring-zinc-700': 'ring-ring',
  'data-[state=active]:bg-zinc-800': 'data-[state=active]:bg-primary',
  'data-[state=active]:text-zinc-100': 'data-[state=active]:text-primary-foreground',
  'hover:bg-zinc-900': 'hover:bg-accent hover:text-accent-foreground',
  'hover:bg-zinc-800': 'hover:bg-accent hover:text-accent-foreground',
  'hover:bg-zinc-700': 'hover:bg-accent hover:text-accent-foreground',
  'hover:text-zinc-100': 'hover:text-foreground',
  'hover:text-zinc-300': 'hover:text-accent-foreground',
};

const files = getFiles(dir);
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [key, value] of Object.entries(map)) {
    // Regex to match exact class name word
    const regex = new RegExp(`(?<=[\\s\`"'])(${key.replace(/\[/g, '\\[').replace(/\]/g, '\\]')})(?=[\\s\`"'])`, 'g');
    content = content.replace(regex, value);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
