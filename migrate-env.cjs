const fs = require('fs');
const path = require('path');

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('import.meta.env.VITE_')) {
                let newContent = content.replace(/import\.meta\.env\.VITE_/g, 'process.env.NEXT_PUBLIC_');
                fs.writeFileSync(filePath, newContent, 'utf8');
            }
        }
    });
}
walk('./src');
