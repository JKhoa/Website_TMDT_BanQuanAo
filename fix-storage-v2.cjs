const fs = require('fs');
const path = require('path');

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('localStorage.') || content.includes('sessionStorage.')) {
                let prefix = `
const safeLocalStorage = {
  getItem: (k) => typeof window !== 'undefined' ? localStorage.getItem(k) : null,
  setItem: (k, v) => typeof window !== 'undefined' ? localStorage.setItem(k, v) : null,
  removeItem: (k) => typeof window !== 'undefined' ? localStorage.removeItem(k) : null,
  clear: () => typeof window !== 'undefined' ? localStorage.clear() : null
};
const safeSessionStorage = {
  getItem: (k) => typeof window !== 'undefined' ? sessionStorage.getItem(k) : null,
  setItem: (k, v) => typeof window !== 'undefined' ? sessionStorage.setItem(k, v) : null,
  removeItem: (k) => typeof window !== 'undefined' ? sessionStorage.removeItem(k) : null,
  clear: () => typeof window !== 'undefined' ? sessionStorage.clear() : null
};
`;
                let changed = false;
                if (content.includes('localStorage.') && !content.includes('safeLocalStorage')) {
                    content = content.replace(/localStorage\./g, 'safeLocalStorage.');
                    changed = true;
                }
                if (content.includes('sessionStorage.') && !content.includes('safeSessionStorage')) {
                    content = content.replace(/sessionStorage\./g, 'safeSessionStorage.');
                    changed = true;
                }
                if (changed) {
                    if (content.startsWith('"use client";')) {
                        content = '"use client";\n' + prefix + content.substring(13);
                    } else {
                        content = prefix + content;
                    }
                    fs.writeFileSync(filePath, content, 'utf8');
                }
            }
        }
    });
}
walk('./src/app');
