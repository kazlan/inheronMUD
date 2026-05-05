import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DOCS = path.join(ROOT_DIR, 'docs');
const DEST_DOCS = path.join(ROOT_DIR, 'apps', 'docs', 'src', 'content', 'docs', 'project');
const API_DOCS = path.join(ROOT_DIR, 'apps', 'docs', 'src', 'content', 'docs', 'api');

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/_/g, '-')             // Replace underscores with hyphens
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
}

function processFile(srcPath, destPath, defaultTitle) {
  try {
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Ensure it has frontmatter
    if (!content.startsWith('---')) {
      let title = defaultTitle;
      const h1Match = content.match(/^#\s+(.+)$/m);
      if (h1Match) {
        title = h1Match[1].trim();
      }
      const frontmatter = `---\ntitle: "${title.replace(/"/g, '\\"')}"\n---\n\n`;
      content = frontmatter + content;
    }

    fs.writeFileSync(destPath, content, 'utf8');
  } catch (err) {
    console.error(`Error processing ${srcPath} -> ${destPath}:`, err.message);
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    if (entry.name === 'api-reference' || entry.name === '.git' || entry.name === 'node_modules') continue;

    const srcPath = path.join(src, entry.name);
    const slug = slugify(path.parse(entry.name).name);
    const ext = path.parse(entry.name).ext;
    const destPath = path.join(dest, entry.isDirectory() ? slugify(entry.name) : (slug + ext));

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
        processFile(srcPath, destPath, path.parse(entry.name).name);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

console.log('Syncing docs with clean slugs and frontmatter...');
if (fs.existsSync(DEST_DOCS)) fs.rmSync(DEST_DOCS, { recursive: true, force: true });

copyRecursive(SRC_DOCS, DEST_DOCS);

// Also process API docs in place
if (fs.existsSync(API_DOCS)) {
  const processDir = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        processDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        processFile(fullPath, fullPath, path.parse(entry.name).name);
      }
    }
  };
  processDir(API_DOCS);
}

console.log('Docs synced successfully.');
