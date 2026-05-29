const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walk('./src/app');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add 'use client' if it uses hooks or client-side context (almost everything here)
    if (!content.includes('use client') && !file.includes('layout.tsx') && !file.includes('\\(shop)\\page.tsx') && !file.includes('page.tsx')) {
        content = '"use client";\n' + content;
        fs.writeFileSync(file, content, 'utf8');
    }
});
console.log('Use Client complete');
