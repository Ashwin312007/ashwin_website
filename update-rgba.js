const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk(srcDir, (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  content = content.replace(/rgba\(0,240,255/g, 'rgba(0,163,255');
  content = content.replace(/rgba\(0, 240, 255/g, 'rgba(0, 163, 255');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated shadow rgba in ${filePath}`);
  }
});
