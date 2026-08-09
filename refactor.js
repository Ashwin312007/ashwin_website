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
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Global email replacements
  content = content.replace(/ashwin\.te2007@gmail\.com/g, 'teashwin3@gmail.com');
  content = content.replace(/t\.e\.ashwin2003@gmail\.com/g, 'teashwin3@gmail.com');

  // Replace colors
  content = content.replace(/#00f0ff/g, '#00a3ff');
  content = content.replace(/bg-cyan-500/g, 'bg-blue-500');
  content = content.replace(/text-cyan-400/g, 'text-[#00a3ff]');
  content = content.replace(/border-cyan-500/g, 'border-blue-500');
  content = content.replace(/cyan-300/g, 'blue-300');

  // HeroSection updates
  content = content.replace(/"R&D Lead"/g, '"Secretary"');
  content = content.replace(/"VIT Chennai OSP Club"/g, '"AutoVIT Club"');
  content = content.replace(/animate=\{\{ y: \[0, 8, 0\] \}\}/g, 'animate={{ opacity: [0.5, 1, 0.5] }}');
  content = content.replace(/animate=\{\{ y: \[0, -30, 0\] \}\}/g, 'animate={{ opacity: 1 }}');
  content = content.replace(/MECHATRONICS & ROBOTICS R&D LEAD/g, 'MECHATRONICS & SOFTWARE ENGINEER');

  // NavBar updates
  if (filePath.includes('NavBar.tsx')) {
    // Remove ticker banner
    content = content.replace(/<div className="w-full bg-\[#00a3ff\]\/10 border-b border-\[#00a3ff\]\/20 overflow-hidden hidden md:block">[\s\S]*?<\/div>\s*<\/div>/, '');
    content = content.replace(/\/\/ R&D LEAD/g, '// ENGINEER');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
});
